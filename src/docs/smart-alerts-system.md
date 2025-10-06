# نظام التنبيهات الذكية المحدث

## 🔔 نظرة عامة

تم تطوير نظام التنبيهات الذكية ليعمل ببيانات حقيقية بالكامل مع حفظ دائم لحالة الإشعارات. النظام يدعم الآن جميع أنواع البيانات في العيادة ويحافظ على حالة التنبيهات عبر جلسات التطبيق.

## ✨ الميزات الجديدة

### 1. بيانات حقيقية بالكامل
- ❌ تم إزالة البيانات التجريبية نهائياً
- ✅ جميع التنبيهات تُولد من البيانات الفعلية في قاعدة البيانات
- 🔄 تحديث تلقائي كل 60 ثانية

### 2. حفظ دائم لحالة الإشعارات
- 💾 حفظ حالة القراءة (مقروء/غير مقروء)
- 🙈 حفظ حالة الإخفاء (مخفي/ظاهر)
- ⏰ حفظ حالة التأجيل مع التاريخ
- 🔄 استمرارية الحالة عبر إعادة تشغيل التطبيق

### 3. دعم شامل لجميع أنواع البيانات

#### 📅 تنبيهات المواعيد
- مواعيد اليوم (أولوية عالية)
- مواعيد الغد (أولوية متوسطة)
- مواعيد متأخرة (أولوية عالية)
- تذكير للمواعيد المؤكدة (قبل ساعتين)

#### 💰 تنبيهات المدفوعات
- دفعات معلقة ومتأخرة
- دفعات جزئية تحتاج استكمال
- دفعات مرفوضة أو فاشلة

#### 🦷 تنبيهات العلاجات
- علاجات معلقة لفترة طويلة
- علاجات مكتملة تحتاج متابعة
- علاجات معقدة (تقويم، زراعة، علاج عصب)

#### 💊 تنبيهات الوصفات
- وصفات قديمة تحتاج تجديد (أكثر من 30 يوم)
- وصفات تحتاج متابعة (تحتوي على كلمة "متابعة")

#### 📦 تنبيهات المخزون (جديد!)
- عناصر منتهية الصلاحية
- عناصر قريبة من انتهاء الصلاحية (30 يوم)
- مخزون منخفض أو منتهي

#### 👤 تنبيهات المتابعة
- مرضى لم يزوروا العيادة لفترة طويلة (أكثر من 90 يوم)

## 🛠️ التحسينات التقنية

### قاعدة البيانات
```sql
-- تم تحديث جدول التنبيهات لدعم المخزون
CREATE TABLE smart_alerts (
    id TEXT PRIMARY KEY,
    type TEXT CHECK (type IN ('appointment', 'payment', 'treatment', 'follow_up', 'prescription', 'lab_order', 'inventory')),
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    patient_id TEXT,
    patient_name TEXT,
    related_data TEXT, -- JSON للبيانات المرتبطة
    action_required BOOLEAN DEFAULT FALSE,
    due_date DATETIME,
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    snooze_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### خدمة التنبيهات الذكية
- `SmartAlertsService.getAllAlerts()` - جلب جميع التنبيهات
- `SmartAlertsService.updateAlert()` - تحديث حالة التنبيه
- `SmartAlertsService.createAlert()` - إنشاء تنبيه جديد
- `SmartAlertsService.deleteAlert()` - حذف تنبيه

### Global Store
- حفظ تلقائي للتغييرات في قاعدة البيانات
- تحديث فوري للعداد غير المقروء
- مزامنة الحالة عبر المكونات

## 🎯 كيفية الاستخدام

### 1. عرض التنبيهات
```tsx
import { SmartAlerts } from '@/components/global/SmartAlerts'

<SmartAlerts 
  maxVisible={5}
  showHeader={true}
  compact={false}
  onAlertClick={handleAlertClick}
/>
```

### 2. إدارة حالة التنبيهات
```tsx
const { 
  alerts, 
  unreadAlertsCount,
  markAlertAsRead,
  dismissAlert,
  snoozeAlert 
} = useGlobalStore()

// تعليم كمقروء
await markAlertAsRead(alertId)

// إخفاء التنبيه
await dismissAlert(alertId)

// تأجيل لساعة واحدة
await snoozeAlert(alertId, new Date(Date.now() + 60 * 60 * 1000).toISOString())
```

### 3. إنشاء تنبيه مخصص
```tsx
await SmartAlertsService.createAlert({
  type: 'appointment',
  priority: 'high',
  title: 'تنبيه مخصص',
  description: 'وصف التنبيه',
  patientId: 'patient_id',
  patientName: 'اسم المريض',
  relatedData: { appointmentId: 'apt_id' },
  actionRequired: true
})
```

## 🔧 الإعدادات

### تكرار التحديث
- التحديث التلقائي كل 60 ثانية
- يمكن تغييره في `SmartAlerts.tsx`

### أولويات التنبيهات
- **عالية**: مواعيد اليوم، دفعات متأخرة أكثر من 7 أيام، مخزون منتهي
- **متوسطة**: مواعيد الغد، دفعات معلقة، مخزون منخفض
- **منخفضة**: متابعات، وصفات قديمة

## 🧪 الاختبار

تم إنشاء ملف اختبار في `src/test/alerts-test.html` لاختبار النظام:

```bash
# فتح ملف الاختبار في المتصفح
open src/test/alerts-test.html
```

## 📊 الإحصائيات

النظام يوفر إحصائيات شاملة:
- إجمالي التنبيهات
- التنبيهات غير المقروءة
- التنبيهات عالية الأولوية
- التنبيهات التي تحتاج إجراء

## 🔮 التطوير المستقبلي

### ميزات مقترحة
- [ ] تنبيهات مخصصة للمستخدم
- [ ] تنبيهات بالبريد الإلكتروني/SMS
- [ ] تجميع التنبيهات المتشابهة
- [ ] فلترة متقدمة للتنبيهات
- [ ] تصدير تقارير التنبيهات

### تحسينات الأداء
- [ ] تحميل تدريجي للتنبيهات
- [ ] ذاكرة تخزين مؤقت للتنبيهات
- [ ] ضغط البيانات المرسلة

## 🐛 استكشاف الأخطاء

### مشاكل شائعة
1. **التنبيهات لا تظهر**: تأكد من وجود بيانات في قاعدة البيانات
2. **الحالة لا تُحفظ**: تحقق من اتصال قاعدة البيانات
3. **التحديث بطيء**: قلل تكرار التحديث التلقائي

### سجلات التشخيص
```javascript
// تفعيل السجلات المفصلة
console.log('📋 Loaded alerts:', alerts.length)
console.log('✅ Alert updated:', alertId)
console.log('💾 Checkpoint result:', checkpoint)
```

## 📝 الخلاصة

نظام التنبيهات الذكية المحدث يوفر:
- ✅ بيانات حقيقية 100%
- ✅ حفظ دائم للحالة
- ✅ دعم شامل لجميع أنواع البيانات
- ✅ واجهة مستخدم محسنة
- ✅ أداء محسن
- ✅ سهولة الصيانة والتطوير

النظام جاهز للاستخدام الإنتاجي ويوفر تجربة مستخدم متميزة لإدارة التنبيهات في عيادة الأسنان.
