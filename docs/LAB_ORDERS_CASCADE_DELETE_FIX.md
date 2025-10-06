# إصلاح مشكلة حذف طلبات المختبر مع العلاجات

## 📋 المشكلة

كانت هناك مشكلة في النظام حيث عند حذف علاج من قسم التعويضات النسية، لا يتم حذف طلب المختبر المرتبط به تلقائياً، مما يؤدي إلى:

- بقاء طلبات مختبر "يتيمة" في النظام
- عدم تطابق البيانات بين العلاجات وطلبات المختبر
- صعوبة في إدارة طلبات المختبر

## 🔧 الحلول المطبقة

### 1. تحديث قاعدة البيانات

**الملف:** `src/database/schema.sql`

تم تغيير العلاقة في جدول `lab_orders`:

```sql
-- قبل الإصلاح
FOREIGN KEY (tooth_treatment_id) REFERENCES tooth_treatments(id) ON DELETE SET NULL

-- بعد الإصلاح
FOREIGN KEY (tooth_treatment_id) REFERENCES tooth_treatments(id) ON DELETE CASCADE
```

### 2. تحسين دالة حذف العلاج

**الملفات:**
- `src/services/databaseService.ts`
- `src/services/databaseService.js`

تم إضافة منطق لحذف طلبات المختبر والدفعات المرتبطة قبل حذف العلاج:

```typescript
async deleteToothTreatment(id: string): Promise<void> {
  const transaction = this.db.transaction(() => {
    // حذف الدفعات المرتبطة أولاً
    const deletePaymentsStmt = this.db.prepare('DELETE FROM payments WHERE tooth_treatment_id = ?')
    const paymentsResult = deletePaymentsStmt.run(id)

    // حذف طلبات المختبر المرتبطة ثانياً
    const deleteLabOrdersStmt = this.db.prepare('DELETE FROM lab_orders WHERE tooth_treatment_id = ?')
    const labOrdersResult = deleteLabOrdersStmt.run(id)

    // ثم حذف العلاج أخيراً
    const deleteTreatmentStmt = this.db.prepare('DELETE FROM tooth_treatments WHERE id = ?')
    const treatmentResult = deleteTreatmentStmt.run(id)

    return treatmentResult.changes > 0
  })

  transaction()
}
```

### 3. تحسين منطق التعديل

**الملف:** `src/components/dental/MultipleToothTreatments.tsx`

تم تحسين منطق تعديل العلاجات ليشمل:

- **حذف طلبات المختبر** عند تغيير التصنيف من "التعويضات" إلى شيء آخر
- **حذف طلبات المختبر** عند إزالة المختبر أو التكلفة من علاج التعويضات
- **تحديث طلبات المختبر** عند تعديل بيانات العلاج

### 4. Migration Script

**الملف:** `src/database/migrations/fix_lab_orders_cascade_delete.sql`

Script لتحديث قواعد البيانات الموجودة:

- إعادة إنشاء جدول `lab_orders` مع العلاقة الصحيحة
- تنظيف طلبات المختبر اليتيمة الموجودة
- إعادة إنشاء الفهارس للأداء

## 🚀 كيفية تطبيق الإصلاح

### للمشاريع الجديدة
الإصلاحات ستكون مطبقة تلقائياً عند إنشاء قاعدة بيانات جديدة.

### للمشاريع الموجودة

#### الطريقة الأولى: تشغيل Script التحديث
```bash
node scripts/fix_lab_orders_cascade.js
```

#### الطريقة الثانية: تنفيذ SQL يدوياً
```bash
sqlite3 dental_clinic.db < src/database/migrations/fix_lab_orders_cascade_delete.sql
```

## ✅ التحقق من نجاح الإصلاح

بعد تطبيق الإصلاح، يمكنك التحقق من:

1. **إضافة علاج تعويضات جديد:**
   - يتم إنشاء طلب مختبر تلقائياً ✅

2. **تعديل علاج تعويضات:**
   - يتم تحديث طلب المختبر المرتبط ✅
   - عند تغيير التصنيف، يتم حذف طلب المختبر ✅

3. **حذف علاج تعويضات:**
   - يتم حذف طلب المختبر المرتبط تلقائياً ✅

## 🔍 التحقق من قاعدة البيانات

للتحقق من العلاقة الجديدة:

```sql
-- عرض بنية جدول lab_orders
.schema lab_orders

-- التحقق من عدم وجود طلبات مختبر يتيمة
SELECT COUNT(*) as orphaned_orders
FROM lab_orders
WHERE tooth_treatment_id IS NOT NULL
AND tooth_treatment_id NOT IN (SELECT id FROM tooth_treatments);
```

## 📊 الملفات المحدثة

1. `src/database/schema.sql` - تحديث العلاقة
2. `src/services/databaseService.ts` - تحسين دالة الحذف
3. `src/services/databaseService.js` - تحسين دالة الحذف
4. `src/components/dental/MultipleToothTreatments.tsx` - تحسين منطق التعديل
5. `src/database/migrations/fix_lab_orders_cascade_delete.sql` - Migration script
6. `scripts/fix_lab_orders_cascade.js` - تشغيل Migration

## 🎯 النتائج المتوقعة

- ✅ حذف العلاج يحذف طلب المختبر تلقائياً
- ✅ تعديل العلاج يحدث طلب المختبر
- ✅ تغيير تصنيف العلاج يدير طلبات المختبر بذكاء
- ✅ لا توجد طلبات مختبر يتيمة في النظام
- ✅ تكامل كامل بين العلاجات وطلبات المختبر

### 3. تحسين منطق التعديل

**الملف:** `src/components/dental/MultipleToothTreatments.tsx`

تم تحسين منطق تعديل العلاجات ليشمل:

- **حذف طلبات المختبر** عند تغيير التصنيف من "التعويضات" إلى شيء آخر
- **حذف طلبات المختبر** عند إزالة المختبر أو التكلفة من علاج التعويضات
- **تحديث طلبات المختبر** عند تعديل بيانات العلاج

### 4. Migration Script

**الملف:** `src/database/migrations/fix_lab_orders_cascade_delete.sql`

Script لتحديث قواعد البيانات الموجودة:

- إعادة إنشاء جدول `lab_orders` مع العلاقة الصحيحة
- تنظيف طلبات المختبر اليتيمة الموجودة
- إعادة إنشاء الفهارس للأداء

### 5. تشغيل Migration

**الملف:** `scripts/fix_lab_orders_cascade.js`

Script Node.js لتشغيل الـ migration بأمان:

```bash
node scripts/fix_lab_orders_cascade.js
```

## 🚀 كيفية تطبيق الإصلاح

### للمشاريع الجديدة:
الإصلاحات ستكون مطبقة تلقائياً عند إنشاء قاعدة بيانات جديدة.

### للمشاريع الموجودة:

1. **تشغيل Migration Script:**
   ```bash
   node scripts/fix_lab_orders_cascade.js
   ```

2. **أو تنفيذ SQL يدوياً:**
   ```bash
   sqlite3 dental_clinic.db < src/database/migrations/fix_lab_orders_cascade_delete.sql
   ```

## ✅ النتائج المتوقعة

بعد تطبيق الإصلاح:

### ✅ الحذف:
- عند حذف علاج من التعويضات، يتم حذف طلب المختبر المرتبط تلقائياً
- لا توجد طلبات مختبر يتيمة في النظام

### ✅ التعديل:
- عند تغيير تصنيف العلاج من "التعويضات" إلى شيء آخر، يتم حذف طلبات المختبر
- عند تعديل بيانات المختبر أو التكلفة، يتم تحديث طلب المختبر
- عند إزالة المختبر من علاج التعويضات، يتم حذف طلب المختبر

### ✅ الإضافة:
- تعمل كما هو مطلوب (لم تتغير)

## 🔍 التحقق من الإصلاح

لتأكيد نجاح الإصلاح:

1. **إضافة علاج تعويضات جديد** مع مختبر
2. **التحقق من إنشاء طلب المختبر**
3. **حذف العلاج**
4. **التأكد من حذف طلب المختبر تلقائياً**

## 📝 ملاحظات مهمة

- تم الحفاظ على جميع الوظائف الموجودة
- الإصلاح متوافق مع الإصدارات السابقة
- تم إضافة logging مفصل لتتبع العمليات
- تم استخدام transactions لضمان سلامة البيانات

## 🛠️ الملفات المحدثة

1. `src/database/schema.sql` - تحديث العلاقات
2. `src/services/databaseService.ts` - تحسين دالة الحذف
3. `src/services/databaseService.js` - تحسين دالة الحذف
4. `src/components/dental/MultipleToothTreatments.tsx` - تحسين منطق التعديل
5. `src/database/migrations/fix_lab_orders_cascade_delete.sql` - Migration script
6. `scripts/fix_lab_orders_cascade.js` - تشغيل Migration
7. `docs/LAB_ORDERS_CASCADE_DELETE_FIX.md` - هذا الملف

## 🆕 تحديث جديد: حذف الدفعات المرتبطة بالعلاج

### التحديثات المضافة:

#### 1. تحديث دالة حذف العلاج
تم تحديث دالة `deleteToothTreatment` في كلا الملفين:
- `src/services/databaseService.ts`
- `src/services/databaseService.js`

لتتضمن حذف الدفعات المرتبطة بالعلاج قبل حذف العلاج نفسه.

#### 2. إضافة دالة مساعدة جديدة
تم إضافة دالة `deletePaymentsByToothTreatment` لحذف جميع الدفعات المرتبطة بعلاج معين.

#### 3. تحديث Store الدفعات
تم تحديث `src/store/paymentStore.ts` للاستماع لأحداث حذف العلاج وتحديث قائمة الدفعات تلقائياً.

#### 4. تحديث Store العلاجات
تم تحديث `src/store/dentalTreatmentStore.ts` لإرسال إشعار عند حذف العلاج لتحديث Store الدفعات.

### ✅ النتائج الجديدة:

- **حذف العلاج** يحذف جميع الدفعات المرتبطة تلقائياً
- **حذف العلاج** يحذف جميع طلبات المختبر المرتبطة تلقائياً
- **تحديث فوري** لواجهة المستخدم عند حذف العلاج
- **عدم وجود دفعات يتيمة** في النظام
- **تكامل كامل** بين العلاجات والدفعات وطلبات المختبر

### 🔄 ترتيب عمليات الحذف:

1. **حذف الدفعات المرتبطة** بالعلاج أولاً
2. **حذف طلبات المختبر المرتبطة** بالعلاج ثانياً
3. **حذف العلاج** نفسه أخيراً

هذا الترتيب يضمن عدم وجود مراجع يتيمة في قاعدة البيانات.
