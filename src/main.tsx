import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import './styles/globals.css'
import { isDemoMode, initializeDemoMode } from './config/demoMode'
import { initializeMockIpcHandlers } from './services/mockIpcHandlers'

// ✅ معالج الأخطاء الشامل لـ React
console.log('🚀 Starting React application...')

// Initialize Mock IPC Handlers for both demo and normal modes
// This ensures the app works without Electron in browser mode
console.log('🎭 Initializing mock services for browser compatibility...')
initializeDemoMode()
initializeMockIpcHandlers()

// Also try to initialize after a short delay to ensure it's available when stores load
setTimeout(() => {
  console.log('🎭 Re-initializing mock services after delay...')
  initializeMockIpcHandlers()
}, 100)

// And once more after React has loaded
setTimeout(() => {
  console.log('🎭 Final mock services initialization...')
  initializeMockIpcHandlers()
}, 500)

console.log('✅ Mock services initialized successfully')

// Run demo mode tests if in demo mode
if (isDemoMode()) {
  console.log('🎭 Demo Mode detected - running tests...')
  import('./test/demoModeTest').then(({ runAllDemoModeTests }) => {
    runAllDemoModeTests()
  })
}

// التحقق من وجود عنصر root
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Root element not found!')
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      color: #333;
      text-align: center;
    ">
      <div>
        <h1>خطأ في التحميل</h1>
        <p>لم يتم العثور على عنصر الجذر في الصفحة</p>
        <p>يرجى إعادة تشغيل التطبيق</p>
      </div>
    </div>
  `
  throw new Error('Root element not found')
}

console.log('✅ Root element found, creating React root...')

try {
  const root = ReactDOM.createRoot(rootElement)
  console.log('✅ React root created successfully')

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

  console.log('✅ React app rendered successfully')
} catch (error) {
  console.error('❌ Failed to render React app:', error)

  // عرض رسالة خطأ بديلة
  rootElement.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      color: #333;
      text-align: center;
    ">
      <div>
        <h1>خطأ في تحميل التطبيق</h1>
        <p>حدث خطأ أثناء تحميل التطبيق</p>
        <p>يرجى إعادة تشغيل التطبيق أو الاتصال بالدعم الفني</p>
        <details style="margin-top: 20px; text-align: left;">
          <summary>تفاصيل الخطأ</summary>
          <pre style="background: #fff; padding: 10px; border-radius: 4px; margin-top: 10px;">
${error.message}
${error.stack}
          </pre>
        </details>
      </div>
    </div>
  `
}
