
# 部署個人化金融財務管理系統至 GitHub Pages

這份指南將協助您將此專案部署到 GitHub Pages。請按照以下步驟進行操作：

## 第一步：準備 Firebase 環境

1. 前往 [Firebase Console](https://console.firebase.google.com/) 並建立一個新專案。
2. 在「專案總覽」中，點擊「網頁標誌 (</>)」以新增網頁應用程式。
3. 註冊後，您會獲得一份 `firebaseConfig` 物件（如下所示）：
   ```json
   {
     "apiKey": "...",
     "authDomain": "...",
     "projectId": "...",
     "storageBucket": "...",
     "messagingSenderId": "...",
     "appId": "..."
   }
   ```
4. 在 Firebase 控制台左側選單中，點擊 **Authentication**：
   - 點擊「開始使用」。
   - 在「登入方法」頁籤，啟用 **「電子郵件/密碼」**。
5. 在左側選單中，點擊 **Firestore Database**：
   - 點擊「建立資料庫」。
   - 選擇「以測試模式啟動」或設定適當的讀寫規則。

## 第二步：獲取 Google Gemini API KEY

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)。
2. 建立一個新的 API Key 並複製下來。

## 第三步：在 GitHub 上設定 Secrets

1. 在您的 GitHub 儲存庫頁面，點擊 **Settings** 標籤。
2. 在左側邊欄找到 **Secrets and variables** -> **Actions**。
3. 點擊 **New repository secret** 並新增以下兩個 Secret：

   - **Secret 1**:
     - Name: `API_KEY`
     - Value: 貼上您剛剛獲得的 Gemini API Key。
   
   - **Secret 2**:
     - Name: `FIREBASE_CONFIG`
     - Value: 貼上您在 Firebase 獲得的整個 JSON 設定物件（確保是有效的 JSON 格式）。
       例如：`{"apiKey": "AIza...", "authDomain": "...", ...}`

## 第四步：推送到 GitHub 並自動部署

1. 將代碼推送到您的 GitHub 儲存庫的 `main` 分支。
2. GitHub Actions 將會自動觸發 `.github/workflows/deploy.yml` 工作流。
3. 您可以在儲存庫的 **Actions** 標籤中觀察進度。
4. 完成後，前往 **Settings** -> **Pages**，您會看到部署成功的網址（通常是 `https://<您的使用者名>.github.io/<儲存庫名稱>/`）。

## 注意事項：避免白色畫面

- 本專案已在 `vite.config.ts` 中設定 `base: './'`，這對於 GitHub Pages 部署至子目錄非常重要。
- 使用 `HashRouter` 原理（在本應用中通過狀態管理 `currentView` 模擬）以避免重新整理時發生 404。
- 若環境變數未正確注入，應用程式會顯示「離線演示模式」。若發生此情況，請檢查 GitHub Secrets 的名稱是否與 YAML 文件中一致。

祝您使用愉快！
