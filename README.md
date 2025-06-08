# 🌩️ CloudDoc – Secure Cloud File Sharing App

CloudDoc is a secure, full-stack document sharing and previewing platform built with Flask, Google Cloud Storage, and React. Users can upload, preview, download, and share files with others. Shared files are accessible through signed URLs with built-in expiration.

---

## 🔗 GitHub Repository
[Click here to view GitHub Repository](https://github.com/GaneshR2766)

---

## 🚀 Features

- 🔐 User authentication via Firebase Auth / JWT
- 📤 Upload files (any type)
- 📁 View your files & those shared with you
- 📄 Preview PDFs, JPEG, PNG, WEBP inline
- ⬇️ Secure file download via signed URL
- 🔗 Share files with other users by email
- 🛡️ Signed URL expiration for security

---

## 🧱 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | React                          |
| Backend      | Python + Flask                 |
| Auth         | Firebase Auth / JWT            |
| Storage      | Google Cloud Storage (GCS)     |
| Deployment   | Google Cloud Run               |

---

## 📁 Folder Structure in GCS

```
bucket-cloud-doc/
├── user1@gmail.com/
│   ├── file1.pdf
│   └── image.jpg
├── user2@gmail.com/
│   └── video.mp4
```

---

## 📄 API Endpoints

### `POST /upload`
- Upload file for authenticated user

### `GET /files`
- List all own + shared files

### `GET /preview/<filename>?owner=email`
- Get signed URL for file preview

### `GET /download/<filename>?owner=email`
- Get signed URL for file download

### `POST /share`
- Share file with another user

---

## 💡 Usage

1. Log in with your email
2. Upload files to your cloud drive
3. Preview or download your files
4. Share files with friends by email
5. Access shared files under “Shared with Me”

---
## 🎨 Screenshots

> ![Screenshot 2025-06-08 154024](https://github.com/user-attachments/assets/f0bec5ff-d52a-485c-96a7-82d5770ad236)
> ![Screenshot 2025-06-08 154144](https://github.com/user-attachments/assets/adbb0c66-f75e-4743-8462-946b879005b1)
> ![Screenshot 2025-06-08 154236](https://github.com/user-attachments/assets/6eaa4515-6606-482e-99be-60343493dc82)



---

## 🙏 Acknowledgements

- [React](https://reactjs.org)
- [Firebase](https://firebase.google.com/)
- [GoogleCloudService](https://console.cloud.google.com/)
- [Material Icons](https://fonts.google.com/icons)

---

## 👤 Author

**Ganesh R**  
🔗 GitHub: [https://github.com/GaneshR2766](https://github.com/GaneshR2766)

---

## 📜 License

MIT License
