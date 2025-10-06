# نظام التحديث في الوقت الفعلي للتنبيهات

## 📋 نظرة عامة

تم تطوير نظام شامل للتحديث في الوقت الفعلي للتنبيهات يضمن أن أي تعديل يتم على أي تنبيه في النظام يتم تحديثه فوراً في جميع أنحاء التطبيق بدون استثناء.

## 🏗️ البنية المعمارية

### 1. نظام الأحداث (AlertsEventSystem)
- **الموقع**: `src/services/smartAlertsService.ts`
- **الوظيفة**: إدارة الأحداث المباشرة للتنبيهات
- **الأحداث المدعومة**:
  - `alerts:changed` - تغيير عام في التنبيهات
  - `alert:updated` - تحديث تنبيه محدد
  - `alert:created` - إنشاء تنبيه جديد
  - `alert:deleted` - حذف تنبيه

### 2. نظام إشعارات تغيير البيانات (DataChangeNotifier)
- **الموقع**: `src/utils/dataChangeNotifier.ts`
- **الوظيفة**: إرسال إشعارات عند تغيير أي بيانات في النظام
- **الأحداث المدعومة**:
  - أحداث المرضى: `patient:created`, `patient:updated`, `patient:deleted`
  - أحداث المواعيد: `appointment:created`, `appointment:updated`, `appointment:deleted`
  - أحداث الدفعات: `payment:created`, `payment:updated`, `payment:deleted`
  - أحداث العلاجات: `treatment:created`, `treatment:updated`, `treatment:deleted`
  - أحداث الوصفات: `prescription:created`, `prescription:updated`, `prescription:deleted`
  - أحداث المخزون: `inventory:created`, `inventory:updated`, `inventory:deleted`
  - أحداث الاحتياجات: `need:created`, `need:updated`, `need:deleted`

### 3. Global Store المحدث
- **الموقع**: `src/store/globalStore.ts`
- **التحسينات**:
  - إزالة التحديث اليدوي للحالة
  - الاعتماد على نظام الأحداث للتحديث التلقائي
  - مستمعين للأحداث المباشرة وأحداث window

## 🔧 المكونات الرئيسية

### 1. useRealTimeAlerts Hook
- **الموقع**: `src/hooks/useRealTimeAlerts.ts`
- **الوظيفة**: إعداد التحديثات في الوقت الفعلي للتنبيهات
- **الميزات**:
  - الاستماع لأحداث التنبيهات المباشرة
  - الاستماع لأحداث تغيير البيانات
  - التوافق مع الأحداث القديمة
  - تنظيف المستمعين تلقائياً

### 2. useDataChangeNotifications Hook
- **الموقع**: `src/hooks/useDataChangeNotifications.ts`
- **الوظيفة**: إدارة إشعارات تغيير البيانات
- **الميزات**:
  - hooks مخصصة لكل نوع بيانات
  - hook شامل لجميع التغييرات
  - دوال مساعدة لإرسال الإشعارات

### 3. RealTimeIndicator Component
- **الموقع**: `src/components/global/RealTimeIndicator.tsx`
- **الوظيفة**: عرض حالة التحديثات في الوقت الفعلي
- **الميزات**:
  - مؤشر حالة الاتصال
  - عداد التحديثات
  - آخر وقت تحديث
  - عدد التنبيهات غير المقروءة

## 🚀 كيفية الاستخدام

### 1. في المكونات
```tsx
import { useRealTimeAlerts } from '@/hooks/useRealTimeAlerts'

function MyComponent() {
  // إعداد التحديثات في الوقت الفعلي
  const { refreshAlerts } = useRealTimeAlerts()
  
  // المكون سيتلقى تحديثات تلقائية
  return <div>...</div>
}
```

### 2. إرسال إشعارات تغيير البيانات
```tsx
import { useDataNotifier } from '@/hooks/useDataChangeNotifications'

function PatientForm() {
  const { notifyPatientCreated, notifyPatientUpdated } = useDataNotifier()
  
  const handleSave = async (patient) => {
    if (patient.id) {
      await updatePatient(patient)
      notifyPatientUpdated(patient.id, patient)
    } else {
      const newPatient = await createPatient(patient)
      notifyPatientCreated(newPatient.id, newPatient)
    }
  }
}
```

### 3. الاستماع لتغييرات محددة
```tsx
import { usePatientChangeListener } from '@/hooks/useDataChangeNotifications'

function PatientList() {
  usePatientChangeListener((event, payload) => {
    console.log(`Patient ${event}:`, payload)
    // إعادة تحميل قائمة المرضى
    refreshPatients()
  })
}
```

## 🔄 تدفق العمل

### 1. عند تحديث تنبيه:
1. استدعاء `SmartAlertsService.updateAlert()`
2. إرسال حدث `alert:updated` عبر `AlertsEventSystem`
3. إرسال حدث `alerts:changed`
4. تحديث `globalStore` تلقائياً
5. إعادة رسم جميع المكونات المتأثرة

### 2. عند تغيير البيانات:
1. استدعاء دالة الإشعار المناسبة (مثل `notifyPatientUpdated`)
2. إرسال حدث عبر `DataChangeNotifier`
3. إرسال أحداث قديمة للتوافق
4. إشعار نظام التنبيهات
5. إعادة توليد التنبيهات المتأثرة

## 📊 مؤشرات الأداء

### 1. تقليل التحديثات غير الضرورية
- تحديث دوري كل 30 ثانية بدلاً من 10 ثواني
- تحديثات فورية عند تغيير البيانات
- تحديث محدد للتنبيهات المتأثرة فقط

### 2. إدارة الذاكرة
- تنظيف المستمعين تلقائياً
- إزالة الأحداث المنتهية الصلاحية
- تجنب تسريب الذاكرة

## 🛡️ الأمان والموثوقية

### 1. معالجة الأخطاء
- try-catch في جميع معالجات الأحداث
- تسجيل الأخطاء مع تفاصيل كاملة
- عدم توقف النظام عند حدوث خطأ

### 2. التوافق مع النظام القديم
- دعم الأحداث القديمة
- تحويل تلقائي للأحداث الجديدة
- عدم كسر الوظائف الموجودة

## 🔧 التكوين والإعدادات

### 1. فترات التحديث
- التحديث الدوري: 30 ثانية
- فحص الاتصال: 30 ثانية
- انقطاع الاتصال: دقيقتان بدون تحديث

### 2. أنواع الأحداث
- أحداث مباشرة عبر `AlertsEventSystem`
- أحداث window للتوافق
- أحداث تغيير البيانات عبر `DataChangeNotifier`

## 📈 المزايا

### 1. التحديث الفوري
- أي تعديل على التنبيهات يظهر فوراً
- لا حاجة لإعادة تحميل الصفحة
- تحديث جميع المكونات المتأثرة

### 2. الكفاءة
- تقليل استهلاك الموارد
- تحديثات محددة وذكية
- إدارة أفضل للذاكرة

### 3. الموثوقية
- نظام احتياطي للأحداث
- معالجة شاملة للأخطاء
- توافق مع النظام القديم

## 🚀 التطوير المستقبلي

### 1. تحسينات مخططة
- دعم WebSocket للتحديثات الفورية
- ضغط الأحداث المتتالية
- تحليلات أداء متقدمة

### 2. ميزات إضافية
- إشعارات push للمتصفح
- تزامن عبر علامات تبويب متعددة
- تخزين مؤقت ذكي للتنبيهات

## 📝 ملاحظات التطوير

### 1. أفضل الممارسات
- استخدام hooks المخصصة
- تنظيف المستمعين دائماً
- تسجيل الأحداث للتتبع

### 2. اختبار النظام
- اختبار جميع أنواع الأحداث
- التأكد من التنظيف الصحيح
- مراقبة الأداء والذاكرة

هذا النظام يضمن أن أي تعديل على أي تنبيه في النظام يتم تحديثه في الوقت الفعلي عبر كل المشروع بدون استثناء، كما طلبت.
