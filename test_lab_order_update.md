# اختبار إصلاح مشكلة تحديث طلبات المخبر

## المشكلة الأصلية
عند تحديث علاج له طلب في المخبر، كان يتم إنشاء سجل جديد بدلاً من تحديث السجل الموجود.
**المشكلة الإضافية**: مربع حوار التعديل لا يعرض اسم المخبر والتكلفة الحالية.
**السبب المكتشف**: متغيرات المخبر (`selectedLab` و `labCost`) مشتركة بين نموذج الإضافة والتعديل، مما يؤدي إلى عدم إنشاء طلب المخبر عند الإضافة.

## الإصلاحات المطبقة

### 1. إصلاح المشكلة الأساسية - فصل متغيرات الإضافة والتعديل
- فصل متغيرات المخبر: `addSelectedLab` و `addLabCost` للإضافة، `selectedLab` و `labCost` للتعديل
- تحديث دالة `createLabOrderForTreatment` لتستخدم متغيرات الإضافة
- تحديث واجهة المستخدم لنموذج الإضافة لتستخدم المتغيرات الصحيحة
- إضافة تسجيل مفصل لتتبع قيم المتغيرات عند الإنشاء

### 2. إصلاح مشكلة تحديث Store بعد الربط
- تحديث `updateLabOrder` في store لإعادة تحميل البيانات من قاعدة البيانات
- إضافة انتظار إضافي بعد عمليات الربط
- إضافة محاولات متعددة للبحث بعد الربط
- إضافة تحقق من نجاح الربط مباشرة من قاعدة البيانات

### 3. تحسين تحميل البيانات في نموذج التعديل
- تحسين دالة `getLabOrdersWithRetry` مع إعادة محاولة أكثر قوة
- إضافة `useEffect` منفصل لمراقبة تغيير الفئة
- إضافة دالة `reloadLabData` لإعادة تحميل البيانات يدوياً
- تحسين تحميل البيانات عند فتح نموذج التعديل

### 4. تحسين واجهة المستخدم
- إضافة عرض للقيم الحالية في عنوان كارد المخبر
- إضافة زر إعادة تحميل البيانات (🔄)
- إضافة زر ربط طلبات المخبر (🔗)
- إضافة رسائل تسجيل مفصلة لتتبع التغييرات

### 2. تحسين store في labOrderStore.ts
- تحديث البيانات محلياً بدلاً من إعادة تحميل كامل بعد التحديث
- إضافة رسائل تسجيل مفصلة
- تحسين معالجة الأخطاء

### 3. تحسين قاعدة البيانات في databaseService.ts
- إضافة التحقق من وجود السجل قبل التحديث
- إضافة رسائل تسجيل مفصلة
- إضافة WAL checkpoint لضمان كتابة البيانات
- تحسين معالجة الأخطاء

## خطوات الاختبار

### اختبار 1: إنشاء علاج جديد مع طلب مخبر
1. إضافة علاج جديد من فئة "التعويضات"
2. اختيار مخبر وإدخال تكلفة مخبر
3. حفظ العلاج
4. **النتيجة المتوقعة**:
   - يجب إنشاء العلاج بنجاح
   - يجب إنشاء طلب مخبر مرتبط بالعلاج
   - يجب ظهور رسالة "تم إنشاء طلب المخبر بنجاح"
   - في console: `🏭 [DEBUG] Creating lab order with data: {...}`

### اختبار 2: تعديل العلاج وعرض بيانات المخبر
1. فتح نموذج تعديل العلاج الذي تم إنشاؤه في الاختبار السابق
2. **النتيجة المتوقعة**:
   - يجب ظهور اسم المخبر المختار في القائمة المنسدلة
   - يجب ظهور تكلفة المخبر في حقل التكلفة
   - يجب ظهور المعلومات في عنوان كارد المخبر

### اختبار 3: تحديث طلب مخبر موجود
1. في نموذج التعديل، تغيير تكلفة المخبر أو المخبر المختار
2. حفظ التعديل
3. **النتيجة المتوقعة**: يجب تحديث طلب المخبر الموجود وليس إنشاء سجل جديد

### اختبار 3: استخدام زر إعادة التحميل المحسن
1. فتح نموذج تعديل علاج من فئة "التعويضات"
2. اضغط على زر 🔄 في عنوان كارد المخبر
3. **النتيجة المتوقعة**:
   - يجب محاولة ربط طلبات المخبر غير المرتبطة تلقائياً
   - يجب تحميل البيانات وظهورها في الحقول

### اختبار 4: إنشاء طلب مخبر جديد
1. إنشاء علاج جديد من فئة غير "التعويضات"
2. حفظ العلاج
3. تعديل العلاج وتغيير الفئة إلى "التعويضات"
4. إضافة مخبر وتكلفة مخبر
5. حفظ التعديل
6. **النتيجة المتوقعة**: يجب إنشاء طلب مخبر جديد

### اختبار 5: حذف طلب مخبر
1. إنشاء علاج من فئة "التعويضات" مع طلب مخبر
2. تعديل العلاج وتغيير الفئة إلى فئة أخرى
3. حفظ التعديل
4. **النتيجة المتوقعة**: يجب حذف طلب المخبر

### اختبار 6: التحقق من البيانات
1. بعد كل عملية تحديث، تحقق من:
   - عدد طلبات المخبر في قاعدة البيانات
   - صحة البيانات المحدثة
   - عدم وجود سجلات مكررة
   - ظهور البيانات الصحيحة في عنوان كارد المخبر

## رسائل التسجيل للمراقبة

ابحث عن هذه الرسائل في console:

```
🔄 [DEBUG] Loading all lab orders from database...
📋 [DEBUG] Loaded lab orders: {total: X, allOrders: [...], ordersWithTreatmentId: [...], ordersWithoutTreatmentId: [...]}
🔍 [DEBUG] getLabOrdersByTreatment called: {treatmentId, totalOrders, matchingOrders, allOrdersWithTreatmentId}
🔍 [DEBUG] Searching lab orders directly in database for treatment: [ID]
📋 [DEBUG] Direct database search results: {treatmentId, totalOrders, matchingOrders, unlinkedOrders, matchingOrdersDetails, unlinkedOrdersDetails}
🔗 [DEBUG] Attempting to link unlinked lab order to treatment: [ID]
🔗 [DEBUG] Found unlinked lab order, attempting to link: [order_id]
✅ [DEBUG] Successfully linked lab order to treatment
🔍 [DEBUG] Comparison of search methods: {directResults, storeResults, treatmentId}
🔄 [DEBUG] Loading data for treatment edit dialog: [ID]
🔍 [DEBUG] Loading lab data for prosthetic treatment: [ID]
🔍 [DEBUG] Initial load comparison: {directResults, storeResults, treatmentId}
✅ [DEBUG] Setting lab data from existing order: {source: 'direct'/'store'/'linked', ...}
✅ [DEBUG] Lab ID set to: [ID]
✅ [DEBUG] Lab cost set to: [amount]
🔄 [DEBUG] Lab selection changed to: [lab_name]
🔄 [DEBUG] Lab cost changed to: [amount]
🔄 [DEBUG] Manual reload of lab data requested
🔗 [DEBUG] No linked orders found, attempting to link unlinked orders
✅ [DEBUG] Lab data reloaded after linking: {source: 'linked', ...}
🔍 [DEBUG] Update comparison: {directResults, storeResults, treatmentId}
✅ [DEBUG] Updating existing lab order: [ID]
✅ [DEBUG] Lab order update verified successfully
➕ [DEBUG] Creating new lab order
✅ [DEBUG] Lab order creation verified successfully
🗑️ [DEBUG] Deleting lab orders due to [reason]
```

## التحقق من النجاح

### في نموذج التعديل:
- يجب ظهور اسم المخبر المختار في القائمة المنسدلة
- يجب ظهور تكلفة المخبر في حقل التكلفة
- يجب ظهور المعلومات في عنوان كارد المخبر (مثل: "مخبر: اسم المخبر | تكلفة: $100")
- زر إعادة التحميل (🔄) يجب أن يعمل بشكل صحيح

### في قاعدة البيانات:
- لا يجب ظهور سجلات مكررة في جدول طلبات المخبر
- يجب تحديث البيانات بشكل صحيح
- يجب ظهور رسائل النجاح المناسبة
- يجب عدم ظهور أخطاء في console

## ملاحظات إضافية

- تم إضافة انتظار قصير (50-100ms) لضمان تحديث البيانات
- تم إضافة إعادة محاولة للحصول على البيانات المحدثة
- تم تحسين معالجة الأخطاء وإضافة رسائل واضحة
- تم إضافة WAL checkpoint في قاعدة البيانات لضمان كتابة البيانات
