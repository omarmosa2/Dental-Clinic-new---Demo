import type {
  QuickAccessData,
  ActivityLog,
  Patient,
  Appointment,
  Payment,
  ToothTreatment
} from '@/types'

/**
 * خدمة الوصول السريع
 * توفر بيانات سريعة للوصول والعمليات الشائعة
 */
export class QuickAccessService {

  /**
   * جلب بيانات الوصول السريع
   */
  static async getQuickAccessData(): Promise<QuickAccessData> {
    try {
      // جلب البيانات بشكل متوازي
      const [
        recentPatients,
        todayAppointments,
        pendingPayments,
        urgentTreatments,
        recentActivities
      ] = await Promise.all([
        this.getRecentPatients(),
        this.getTodayAppointments(),
        this.getPendingPayments(),
        this.getUrgentTreatments(),
        this.getRecentActivities()
      ])

      // حساب الإحصائيات السريعة
      const quickStats = await this.getQuickStats()

      return {
        recentPatients,
        todayAppointments,
        pendingPayments,
        urgentTreatments,
        recentActivities,
        quickStats
      }

    } catch (error) {
      console.error('Error getting quick access data:', error)
      throw new Error('فشل في جلب بيانات الوصول السريع')
    }
  }

  /**
   * جلب المرضى الأخيرين
   */
  private static async getRecentPatients(): Promise<Patient[]> {
    try {
      const patients = await window.electronAPI?.patients?.getAll?.() || []

      // إذا لم توجد بيانات، إرجاع مصفوفة فارغة
      if (patients.length === 0) {
        return []
      }

      // ترتيب حسب آخر تحديث وأخذ أول 5
      return patients
        .sort((a: Patient, b: Patient) =>
          new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
        )
        .slice(0, 5)

    } catch (error) {
      console.error('Error getting recent patients:', error)
      return []
    }
  }

  /**
   * جلب مواعيد اليوم
   */
  private static async getTodayAppointments(): Promise<Appointment[]> {
    try {
      const appointments = await window.electronAPI?.appointments?.getAll?.() || []
      const today = new Date()

      return appointments.filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.start_time)
        return this.isSameDay(appointmentDate, today)
      }).sort((a: Appointment, b: Appointment) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      )

    } catch (error) {
      console.error('Error getting today appointments:', error)
      return []
    }
  }

  /**
   * جلب الدفعات المعلقة
   */
  private static async getPendingPayments(): Promise<Payment[]> {
    try {
      const payments = await window.electronAPI?.payments?.getAll?.() || []

      return payments
        .filter((payment: Payment) =>
          payment.status === 'pending' &&
          payment.remaining_balance &&
          payment.remaining_balance > 0
        )
        .sort((a: Payment, b: Payment) =>
          new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime()
        )
        .slice(0, 10) // أول 10 دفعات معلقة

    } catch (error) {
      console.error('Error getting pending payments:', error)
      return []
    }
  }

  /**
   * جلب العلاجات العاجلة
   */
  private static async getUrgentTreatments(): Promise<ToothTreatment[]> {
    try {
      // استخدام treatments API بدلاً من toothTreatments
      const treatments = await window.electronAPI?.treatments?.getAll?.() || []
      const today = new Date()

      return treatments
        .filter((treatment: ToothTreatment) => {
          // العلاجات المخططة أو قيد التنفيذ
          if (treatment.treatment_status !== 'planned' && treatment.treatment_status !== 'in_progress') {
            return false
          }

          // العلاجات المعلقة لأكثر من أسبوع
          const createdDate = new Date(treatment.created_at)
          const daysPending = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

          return daysPending > 7
        })
        .sort((a: ToothTreatment, b: ToothTreatment) => {
          // ترتيب حسب الأولوية ثم التاريخ
          if (a.priority !== b.priority) {
            return a.priority - b.priority // أولوية أقل = أهمية أكبر
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
        .slice(0, 8) // أول 8 علاجات عاجلة

    } catch (error) {
      console.error('Error getting urgent treatments:', error)
      return []
    }
  }

  /**
   * جلب الأنشطة الأخيرة
   */
  private static async getRecentActivities(): Promise<ActivityLog[]> {
    try {
      // في الوقت الحالي، سنولد أنشطة وهمية
      // يمكن تطوير هذا لاحقاً لجلب الأنشطة الفعلية من قاعدة البيانات
      const activities: ActivityLog[] = []

      // جلب آخر المرضى المضافين
      const patients = await window.electronAPI?.patients?.getAll?.() || []
      const recentPatients = patients
        .sort((a: Patient, b: Patient) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3)

      recentPatients.forEach((patient: Patient) => {
        activities.push({
          id: `patient_added_${patient.id}`,
          type: 'patient_added',
          title: 'مريض جديد',
          description: `تم إضافة المريض ${patient.full_name}`,
          patientId: patient.id,
          patientName: patient.full_name,
          timestamp: patient.created_at,
          icon: '👤'
        })
      })

      // جلب آخر المواعيد المكتملة
      const appointments = await window.electronAPI?.appointments?.getAll?.() || []
      const completedAppointments = appointments
        .filter((apt: Appointment) => apt.status === 'completed')
        .sort((a: Appointment, b: Appointment) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 3)

      completedAppointments.forEach((appointment: Appointment) => {
        activities.push({
          id: `appointment_completed_${appointment.id}`,
          type: 'appointment_created',
          title: 'موعد مكتمل',
          description: `تم إكمال موعد ${appointment.patient?.full_name || 'مريض غير محدد'}`,
          patientId: appointment.patient_id,
          patientName: appointment.patient?.full_name,
          timestamp: appointment.updated_at,
          icon: '📅'
        })
      })

      // جلب آخر الدفعات
      const payments = await window.electronAPI?.payments?.getAll?.() || []
      const recentPayments = payments
        .filter((payment: Payment) => payment.status === 'completed')
        .sort((a: Payment, b: Payment) =>
          new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
        )
        .slice(0, 3)

      recentPayments.forEach((payment: Payment) => {
        activities.push({
          id: `payment_received_${payment.id}`,
          type: 'payment_received',
          title: 'دفعة مستلمة',
          description: `تم استلام دفعة ${payment.amount}$ من ${payment.patient?.full_name || 'مريض غير محدد'}`,
          patientId: payment.patient_id,
          patientName: payment.patient?.full_name,
          timestamp: payment.payment_date,
          icon: '💰'
        })
      })

      // ترتيب الأنشطة حسب التاريخ
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)

    } catch (error) {
      console.error('Error getting recent activities:', error)
      return []
    }
  }

  /**
   * جلب الإحصائيات السريعة
   */
  private static async getQuickStats(): Promise<QuickAccessData['quickStats']> {
    try {
      const [patients, appointments, payments] = await Promise.all([
        window.electronAPI?.patients?.getAll?.() || [],
        window.electronAPI?.appointments?.getAll?.() || [],
        window.electronAPI?.payments?.getAll?.() || []
      ])

      const today = new Date()

      // عدد المرضى الإجمالي
      const totalPatients = patients.length

      // مواعيد اليوم
      const todayAppointments = appointments.filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.start_time)
        return this.isSameDay(appointmentDate, today)
      }).length

      // الدفعات المعلقة
      const pendingPayments = payments.filter((payment: Payment) =>
        payment.status === 'pending' &&
        payment.remaining_balance &&
        payment.remaining_balance > 0
      ).length

      // التنبيهات العاجلة - مؤقتاً نضع 0 حتى يتم تطبيق نظام التنبيهات
      const urgentAlerts = 0

      return {
        totalPatients,
        todayAppointments,
        pendingPayments,
        urgentAlerts
      }

    } catch (error) {
      console.error('Error getting quick stats:', error)
      return {
        totalPatients: 0,
        todayAppointments: 0,
        pendingPayments: 0,
        urgentAlerts: 0
      }
    }
  }

  /**
   * تحديث بيانات الوصول السريع
   */
  static async refreshQuickAccessData(): Promise<QuickAccessData> {
    return this.getQuickAccessData()
  }

  /**
   * جلب المرضى الأكثر زيارة
   */
  static async getMostVisitedPatients(): Promise<Patient[]> {
    try {
      const appointments = await window.electronAPI?.appointments?.getAll?.() || []
      const patients = await window.electronAPI?.patients?.getAll?.() || []

      // حساب عدد الزيارات لكل مريض
      const visitCounts: { [key: string]: number } = {}

      appointments.forEach((appointment: Appointment) => {
        if (appointment.patient_id && appointment.status === 'completed') {
          visitCounts[appointment.patient_id] = (visitCounts[appointment.patient_id] || 0) + 1
        }
      })

      // ترتيب المرضى حسب عدد الزيارات
      return patients
        .filter((patient: Patient) => visitCounts[patient.id] > 0)
        .sort((a: Patient, b: Patient) =>
          (visitCounts[b.id] || 0) - (visitCounts[a.id] || 0)
        )
        .slice(0, 10)

    } catch (error) {
      console.error('Error getting most visited patients:', error)
      return []
    }
  }

  /**
   * جلب المرضى الذين لم يزوروا لفترة طويلة
   */
  static async getPatientsNeedingFollowUp(): Promise<Patient[]> {
    try {
      const appointments = await window.electronAPI?.appointments?.getAll?.() || []
      const patients = await window.electronAPI?.patients?.getAll?.() || []
      const today = new Date()

      // حساب آخر زيارة لكل مريض
      const lastVisits: { [key: string]: Date } = {}

      appointments.forEach((appointment: Appointment) => {
        if (appointment.patient_id && appointment.status === 'completed') {
          const appointmentDate = new Date(appointment.start_time)
          if (!lastVisits[appointment.patient_id] || appointmentDate > lastVisits[appointment.patient_id]) {
            lastVisits[appointment.patient_id] = appointmentDate
          }
        }
      })

      // البحث عن المرضى الذين لم يزوروا لأكثر من 3 أشهر
      return patients.filter((patient: Patient) => {
        const lastVisit = lastVisits[patient.id]
        if (!lastVisit) return false

        const daysSinceLastVisit = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceLastVisit > 90
      }).slice(0, 10)

    } catch (error) {
      console.error('Error getting patients needing follow up:', error)
      return []
    }
  }

  // Helper methods
  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }
}
