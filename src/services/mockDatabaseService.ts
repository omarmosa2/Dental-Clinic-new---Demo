/**
 * Mock Database Service for Demo Mode
 * This service provides in-memory database functionality using localStorage
 * when the application is running in demo mode
 */

import { demoModeUtils, getDefaultDemoData, type DemoDataStructure } from '../config/demoMode'
import { v4 as uuidv4 } from 'uuid'
import type {
  Patient,
  Appointment,
  Payment,
  Treatment,
  InventoryItem,
  ClinicSettings,
  DashboardStats,
  Lab,
  LabOrder,
  Medication,
  Prescription,
  DentalTreatmentImage,
  ToothTreatment,
  ToothTreatmentImage,
  ClinicExpense
} from '../types'

export class MockDatabaseService {
  private data: DemoDataStructure

  constructor() {
    this.data = this.loadData()
  }

  /**
   * Load data from localStorage or initialize with default data
   */
  private loadData(): DemoDataStructure {
    const storedData = demoModeUtils.loadFromStorage('data')
    if (storedData) {
      return storedData
    }
    
    const defaultData = getDefaultDemoData()
    this.saveData(defaultData)
    return defaultData
  }

  /**
   * Save data to localStorage
   */
  private saveData(data: DemoDataStructure): void {
    demoModeUtils.saveToStorage('data', data)
    this.data = data
  }

  /**
   * Get all data
   */
  private getAllData(): DemoDataStructure {
    return this.data
  }

  /**
   * Update data
   */
  private updateData(updater: (data: DemoDataStructure) => DemoDataStructure): void {
    const newData = updater(this.data)
    this.saveData(newData)
  }

  // ==================== PATIENTS ====================

  async getAllPatients(): Promise<Patient[]> {
    return this.data.patients
  }

  async createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      patients: [...data.patients, newPatient]
    }))

    return newPatient
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    const existingPatient = this.data.patients.find(p => p.id === id)
    if (!existingPatient) {
      throw new Error('Patient not found')
    }

    const updatedPatient: Patient = {
      ...existingPatient,
      ...patient,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      patients: data.patients.map(p => p.id === id ? updatedPatient : p)
    }))

    return updatedPatient
  }

  async deletePatient(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      patients: data.patients.filter(p => p.id !== id),
      appointments: data.appointments.filter(a => a.patient_id !== id),
      payments: data.payments.filter(p => p.patient_id !== id)
    }))

    return true
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.patients.filter(patient =>
      patient.name?.toLowerCase().includes(lowerQuery) ||
      patient.phone?.toLowerCase().includes(lowerQuery) ||
      patient.email?.toLowerCase().includes(lowerQuery) ||
      patient.id?.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== APPOINTMENTS ====================

  async getAllAppointments(): Promise<Appointment[]> {
    return this.data.appointments
  }

  async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      appointments: [...data.appointments, newAppointment]
    }))

    return newAppointment
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const existingAppointment = this.data.appointments.find(a => a.id === id)
    if (!existingAppointment) {
      throw new Error('Appointment not found')
    }

    const updatedAppointment: Appointment = {
      ...existingAppointment,
      ...appointment,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      appointments: data.appointments.map(a => a.id === id ? updatedAppointment : a)
    }))

    return updatedAppointment
  }

  async deleteAppointment(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      appointments: data.appointments.filter(a => a.id !== id)
    }))

    return true
  }

  async searchAppointments(query: string): Promise<Appointment[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.appointments.filter(appointment =>
      appointment.patient_name?.toLowerCase().includes(lowerQuery) ||
      appointment.treatment?.toLowerCase().includes(lowerQuery) ||
      appointment.notes?.toLowerCase().includes(lowerQuery) ||
      appointment.id?.toLowerCase().includes(lowerQuery)
    )
  }

  async checkAppointmentConflict(startTime: string, endTime: string, excludeId?: string): Promise<boolean> {
    const start = new Date(startTime)
    const end = new Date(endTime)

    return this.data.appointments.some(appointment => {
      if (excludeId && appointment.id === excludeId) return false

      const appointmentStart = new Date(appointment.start_time)
      const appointmentEnd = new Date(appointment.end_time)

      return (start < appointmentEnd && end > appointmentStart)
    })
  }

  // ==================== PAYMENTS ====================

  async getAllPayments(): Promise<Payment[]> {
    return this.data.payments
  }

  async getPaymentsByPatient(patientId: string): Promise<Payment[]> {
    return this.data.payments.filter(p => p.patient_id === patientId)
  }

  async createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      payments: [...data.payments, newPayment]
    }))

    return newPayment
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    const existingPayment = this.data.payments.find(p => p.id === id)
    if (!existingPayment) {
      throw new Error('Payment not found')
    }

    const updatedPayment: Payment = {
      ...existingPayment,
      ...payment,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      payments: data.payments.map(p => p.id === id ? updatedPayment : p)
    }))

    return updatedPayment
  }

  async deletePayment(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      payments: data.payments.filter(p => p.id !== id)
    }))

    return true
  }

  async searchPayments(query: string): Promise<Payment[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.payments.filter(payment =>
      payment.patient_name?.toLowerCase().includes(lowerQuery) ||
      payment.treatment?.toLowerCase().includes(lowerQuery) ||
      payment.notes?.toLowerCase().includes(lowerQuery) ||
      payment.id?.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== TREATMENTS ====================

  async getAllTreatments(): Promise<Treatment[]> {
    return this.data.treatments
  }

  async createTreatment(treatment: Omit<Treatment, 'id' | 'created_at' | 'updated_at'>): Promise<Treatment> {
    const newTreatment: Treatment = {
      ...treatment,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      treatments: [...data.treatments, newTreatment]
    }))

    return newTreatment
  }

  async searchTreatments(query: string): Promise<Treatment[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.treatments.filter(treatment =>
      treatment.name?.toLowerCase().includes(lowerQuery) ||
      treatment.description?.toLowerCase().includes(lowerQuery) ||
      treatment.id?.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== INVENTORY ====================

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return this.data.inventory
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      inventory: [...data.inventory, newItem]
    }))

    return newItem
  }

  async updateInventoryItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const existingItem = this.data.inventory.find(i => i.id === id)
    if (!existingItem) {
      throw new Error('Inventory item not found')
    }

    const updatedItem: InventoryItem = {
      ...existingItem,
      ...item,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      inventory: data.inventory.map(i => i.id === id ? updatedItem : i)
    }))

    return updatedItem
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      inventory: data.inventory.filter(i => i.id !== id)
    }))

    return true
  }

  // ==================== LABS ====================

  async getAllLabs(): Promise<Lab[]> {
    return this.data.labs
  }

  async createLab(lab: Omit<Lab, 'id' | 'created_at' | 'updated_at'>): Promise<Lab> {
    const newLab: Lab = {
      ...lab,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      labs: [...data.labs, newLab]
    }))

    return newLab
  }

  async updateLab(id: string, lab: Partial<Lab>): Promise<Lab> {
    const existingLab = this.data.labs.find(l => l.id === id)
    if (!existingLab) {
      throw new Error('Lab not found')
    }

    const updatedLab: Lab = {
      ...existingLab,
      ...lab,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      labs: data.labs.map(l => l.id === id ? updatedLab : l)
    }))

    return updatedLab
  }

  async deleteLab(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      labs: data.labs.filter(l => l.id !== id)
    }))

    return true
  }

  async searchLabs(query: string): Promise<Lab[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.labs.filter(lab =>
      lab.name?.toLowerCase().includes(lowerQuery) ||
      lab.address?.toLowerCase().includes(lowerQuery) ||
      lab.phone?.toLowerCase().includes(lowerQuery) ||
      lab.id?.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== LAB ORDERS ====================

  async getAllLabOrders(): Promise<LabOrder[]> {
    return this.data.labOrders
  }

  async createLabOrder(labOrder: Omit<LabOrder, 'id' | 'created_at' | 'updated_at'>): Promise<LabOrder> {
    const newLabOrder: LabOrder = {
      ...labOrder,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      labOrders: [...data.labOrders, newLabOrder]
    }))

    return newLabOrder
  }

  async updateLabOrder(id: string, labOrder: Partial<LabOrder>): Promise<LabOrder> {
    const existingLabOrder = this.data.labOrders.find(lo => lo.id === id)
    if (!existingLabOrder) {
      throw new Error('Lab order not found')
    }

    const updatedLabOrder: LabOrder = {
      ...existingLabOrder,
      ...labOrder,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      labOrders: data.labOrders.map(lo => lo.id === id ? updatedLabOrder : lo)
    }))

    return updatedLabOrder
  }

  async deleteLabOrder(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      labOrders: data.labOrders.filter(lo => lo.id !== id)
    }))

    return true
  }

  async searchLabOrders(query: string): Promise<LabOrder[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.labOrders.filter(labOrder =>
      labOrder.patient_name?.toLowerCase().includes(lowerQuery) ||
      labOrder.lab_name?.toLowerCase().includes(lowerQuery) ||
      labOrder.treatment?.toLowerCase().includes(lowerQuery) ||
      labOrder.id?.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== MEDICATIONS ====================

  async getAllMedications(): Promise<Medication[]> {
    return this.data.medications
  }

  async createMedication(medication: Omit<Medication, 'id' | 'created_at' | 'updated_at'>): Promise<Medication> {
    const newMedication: Medication = {
      ...medication,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      medications: [...data.medications, newMedication]
    }))

    return newMedication
  }

  async updateMedication(id: string, medication: Partial<Medication>): Promise<Medication> {
    const existingMedication = this.data.medications.find(m => m.id === id)
    if (!existingMedication) {
      throw new Error('Medication not found')
    }

    const updatedMedication: Medication = {
      ...existingMedication,
      ...medication,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      medications: data.medications.map(m => m.id === id ? updatedMedication : m)
    }))

    return updatedMedication
  }

  async deleteMedication(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      medications: data.medications.filter(m => m.id !== id)
    }))

    return true
  }

  async searchMedications(query: string): Promise<Medication[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.medications.filter(medication =>
      medication.name?.toLowerCase().includes(lowerQuery) ||
      medication.description?.toLowerCase().includes(lowerQuery) ||
      medication.id?.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== PRESCRIPTIONS ====================

  async getAllPrescriptions(): Promise<Prescription[]> {
    return this.data.prescriptions
  }

  async createPrescription(prescription: Omit<Prescription, 'id' | 'created_at' | 'updated_at'>): Promise<Prescription> {
    const newPrescription: Prescription = {
      ...prescription,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      prescriptions: [...data.prescriptions, newPrescription]
    }))

    return newPrescription
  }

  async updatePrescription(id: string, prescription: Partial<Prescription>): Promise<Prescription> {
    const existingPrescription = this.data.prescriptions.find(p => p.id === id)
    if (!existingPrescription) {
      throw new Error('Prescription not found')
    }

    const updatedPrescription: Prescription = {
      ...existingPrescription,
      ...prescription,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      prescriptions: data.prescriptions.map(p => p.id === id ? updatedPrescription : p)
    }))

    return updatedPrescription
  }

  async deletePrescription(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      prescriptions: data.prescriptions.filter(p => p.id !== id)
    }))

    return true
  }

  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return this.data.prescriptions.filter(p => p.patient_id === patientId)
  }

  async searchPrescriptions(query: string): Promise<Prescription[]> {
    const lowerQuery = query.toLowerCase()
    return this.data.prescriptions.filter(prescription =>
      prescription.patient_name?.toLowerCase().includes(lowerQuery) ||
      prescription.medication_name?.toLowerCase().includes(lowerQuery) ||
      prescription.notes?.toLowerCase().includes(lowerQuery) ||
      prescription.id?.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== DENTAL TREATMENT IMAGES ====================

  async getAllDentalTreatmentImages(): Promise<DentalTreatmentImage[]> {
    return this.data.dentalTreatmentImages
  }

  async getDentalTreatmentImagesByTreatment(treatmentId: string): Promise<DentalTreatmentImage[]> {
    return this.data.dentalTreatmentImages.filter(img => img.treatment_id === treatmentId)
  }

  async createDentalTreatmentImage(image: Omit<DentalTreatmentImage, 'id' | 'created_at' | 'updated_at'>): Promise<DentalTreatmentImage> {
    const newImage: DentalTreatmentImage = {
      ...image,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      dentalTreatmentImages: [...data.dentalTreatmentImages, newImage]
    }))

    return newImage
  }

  async deleteDentalTreatmentImage(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      dentalTreatmentImages: data.dentalTreatmentImages.filter(img => img.id !== id)
    }))

    return true
  }

  // ==================== TOOTH TREATMENTS ====================

  async getAllToothTreatments(): Promise<ToothTreatment[]> {
    return this.data.toothTreatments
  }

  async getToothTreatmentsByPatient(patientId: string): Promise<ToothTreatment[]> {
    return this.data.toothTreatments.filter(t => t.patient_id === patientId)
  }

  async getToothTreatmentsByTooth(patientId: string, toothNumber: number): Promise<ToothTreatment[]> {
    return this.data.toothTreatments.filter(t => t.patient_id === patientId && t.tooth_number === toothNumber)
  }

  async createToothTreatment(treatment: Omit<ToothTreatment, 'id' | 'created_at' | 'updated_at'>): Promise<ToothTreatment> {
    const newTreatment: ToothTreatment = {
      ...treatment,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      toothTreatments: [...data.toothTreatments, newTreatment]
    }))

    return newTreatment
  }

  async updateToothTreatment(id: string, treatment: Partial<ToothTreatment>): Promise<ToothTreatment> {
    const existingTreatment = this.data.toothTreatments.find(t => t.id === id)
    if (!existingTreatment) {
      throw new Error('Tooth treatment not found')
    }

    const updatedTreatment: ToothTreatment = {
      ...existingTreatment,
      ...treatment,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      toothTreatments: data.toothTreatments.map(t => t.id === id ? updatedTreatment : t)
    }))

    return updatedTreatment
  }

  async deleteToothTreatment(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      toothTreatments: data.toothTreatments.filter(t => t.id !== id)
    }))

    return true
  }

  async reorderToothTreatments(patientId: string, toothNumber: number, treatmentIds: string[]): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      toothTreatments: data.toothTreatments.map(treatment => {
        if (treatment.patient_id === patientId && treatment.tooth_number === toothNumber) {
          const newOrder = treatmentIds.indexOf(treatment.id)
          return { ...treatment, order: newOrder >= 0 ? newOrder : treatment.order }
        }
        return treatment
      })
    }))

    return true
  }

  // ==================== TOOTH TREATMENT IMAGES ====================

  async getAllToothTreatmentImages(): Promise<ToothTreatmentImage[]> {
    return this.data.toothTreatmentImages
  }

  async getToothTreatmentImagesByTreatment(treatmentId: string): Promise<ToothTreatmentImage[]> {
    return this.data.toothTreatmentImages.filter(img => img.treatment_id === treatmentId)
  }

  async getToothTreatmentImagesByTooth(patientId: string, toothNumber: number): Promise<ToothTreatmentImage[]> {
    return this.data.toothTreatmentImages.filter(img => img.patient_id === patientId && img.tooth_number === toothNumber)
  }

  async createToothTreatmentImage(image: Omit<ToothTreatmentImage, 'id' | 'created_at' | 'updated_at'>): Promise<ToothTreatmentImage> {
    const newImage: ToothTreatmentImage = {
      ...image,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      toothTreatmentImages: [...data.toothTreatmentImages, newImage]
    }))

    return newImage
  }

  async deleteToothTreatmentImage(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      toothTreatmentImages: data.toothTreatmentImages.filter(img => img.id !== id)
    }))

    return true
  }

  // ==================== CLINIC EXPENSES ====================

  async getAllClinicExpenses(): Promise<ClinicExpense[]> {
    return this.data.clinicExpenses
  }

  async createClinicExpense(expense: Omit<ClinicExpense, 'id' | 'created_at' | 'updated_at'>): Promise<ClinicExpense> {
    const newExpense: ClinicExpense = {
      ...expense,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      clinicExpenses: [...data.clinicExpenses, newExpense]
    }))

    return newExpense
  }

  async updateClinicExpense(id: string, expense: Partial<ClinicExpense>): Promise<ClinicExpense> {
    const existingExpense = this.data.clinicExpenses.find(e => e.id === id)
    if (!existingExpense) {
      throw new Error('Clinic expense not found')
    }

    const updatedExpense: ClinicExpense = {
      ...existingExpense,
      ...expense,
      id,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      clinicExpenses: data.clinicExpenses.map(e => e.id === id ? updatedExpense : e)
    }))

    return updatedExpense
  }

  async deleteClinicExpense(id: string): Promise<boolean> {
    this.updateData(data => ({
      ...data,
      clinicExpenses: data.clinicExpenses.filter(e => e.id !== id)
    }))

    return true
  }

  // ==================== SETTINGS ====================

  async getSettings(): Promise<ClinicSettings | null> {
    return this.data.settings
  }

  async updateSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings> {
    const updatedSettings: ClinicSettings = {
      ...this.data.settings,
      ...settings,
      updated_at: new Date().toISOString()
    }

    this.updateData(data => ({
      ...data,
      settings: updatedSettings
    }))

    return updatedSettings
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats(): Promise<DashboardStats> {
    const patients = this.data.patients.length
    const appointments = this.data.appointments.length
    const payments = this.data.payments
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    const todayAppointments = this.data.appointments.filter(apt => {
      const today = new Date().toDateString()
      const appointmentDate = new Date(apt.start_time).toDateString()
      return today === appointmentDate
    }).length

    return {
      totalPatients: patients,
      totalAppointments: appointments,
      totalRevenue,
      todayAppointments,
      monthlyRevenue: totalRevenue, // Simplified for demo
      patientGrowth: 0, // Simplified for demo
      appointmentGrowth: 0 // Simplified for demo
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Clear all demo data
   */
  clearAllData(): void {
    const defaultData = getDefaultDemoData()
    this.saveData(defaultData)
  }

  /**
   * Export all data
   */
  exportAllData(): DemoDataStructure {
    return this.getAllData()
  }

  /**
   * Import data
   */
  importData(data: DemoDataStructure): void {
    this.saveData(data)
  }
}
