# IntelliFill Documents feature

## Install and run

1. Extract the full ZIP. In Chrome, open `chrome://extensions`, enable Developer mode, and choose **Load unpacked** with the top-level `IntelliFill` folder—the one containing `manifest.json`. The backend is in its `backend` subfolder.
2. Configure and start the Spring Boot backend from `IntelliFill/backend`. In Windows PowerShell, from that folder, set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and a random `JWT_SECRET` of at least 32 characters, then run `mvn spring-boot:run`. For example:
   ```powershell
   $env:DB_URL = 'jdbc:mysql://localhost:3306/intellifill_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
   $env:DB_USERNAME = 'root'
   $env:DB_PASSWORD = 'your-local-mysql-password'
   $secretBytes = New-Object byte[] 32
   $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
   $rng.GetBytes($secretBytes)
   $env:JWT_SECRET = [Convert]::ToBase64String($secretBytes)
   $rng.Dispose()
   mvn spring-boot:run
   ```
   If your MySQL root account has no password, set `DB_PASSWORD` to an empty string. The backend requires Java 17+ and Maven 3.6.3+. Set `GEMINI_API_KEY` only if using the optional AI fallback. The extension needs a backend sign-in to save extracted structured data.
3. The backend uses the existing MySQL database. With the supplied development setting `spring.jpa.hibernate.ddl-auto=update`, Hibernate creates `extracted_documents`. For managed deployments, apply `backend/src/main/resources/db/migration/V2__extracted_documents.sql` and set Hibernate to `validate`.
4. Sign in from the extension popup, then select **Documents**. Choose up to five files and process them.

The extension bundles PDF.js, Mammoth.js, Tesseract.js, and English OCR data under `vendor`. Parsing/OCR does not call Gemini, the backend, or another network service. The backend endpoint accepts field paths and values only; it never accepts document bytes or raw extracted text. Original files remain in this browser's IndexedDB `documents` store.

## Extraction and profile behavior

Recognized, non-empty personal, address, skills, education, employment, certificate, and project values are saved with the originating document ID and structured path. Existing personal, address, and skills rows use the authenticated partial-update services, which replace matching values while retaining omitted fields. Contextual education and other additional records remain separate in the source document's JSON field map. The existing profile form remains editable and its local profile remains the source used by the current autofill mapper.

The built-in extractor is conservative and label-based; it does not use a cloud model. Scans with poor image quality, unusual layouts, handwriting, or ambiguous labels may yield incomplete results. Review the displayed extracted fields and edit Manage Profile as needed. OCR currently uses English data.

Class 10 and Class 12 admission/registration values keep distinct paths. Autofill uses such a value only for an exact matching course-specific label and only when saved source records agree; ambiguous/conflicting records are left blank. Other additional fields are retained for future mapping but are not guessed into website fields.

## Local configuration and security

The copied backend configuration has no embedded database, Gemini, or JWT credentials. Use environment variables; do not put secrets in extension files. CORS defaults to Chrome extension and localhost origins; set `CORS_ALLOWED_ORIGINS` to the exact allowed origin(s) in production. Existing manual profile setup and the existing Rule Engine, Gemini field-classification fallback, preview/confirmation, and autofill components are retained.

Vendor versions: PDF.js 3.11.174 (Apache-2.0), Mammoth.js 1.8.0 (BSD-2-Clause), Tesseract.js 5.0.4 (Apache-2.0), Tesseract.js-core 5.0.0 (Apache-2.0), and English tessdata 4.0.0. Refer to the upstream license notices before redistributing: [PDF.js](https://github.com/mozilla/pdf.js), [Mammoth.js](https://github.com/mwilliamson/mammoth.js), and [Tesseract.js](https://github.com/naptha/tesseract.js).
