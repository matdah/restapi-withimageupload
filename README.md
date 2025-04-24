
# 📇 Personalhanterare med bild (Node.js + Express + MongoDB)

Detta projekt är ett API för att hantera personal, med stöd för att spara namn, e-postadress och profilbild. API:et är byggt med Node.js, Express, MongoDB och Multer för filuppladdningar.

## 🚀 Funktioner

- Skapa personal med namn, e-post och bild
- Lagra bilder lokalt
- Filtrering av tillåtna bildtyper (JPEG, PNG, WebP)
- Unik validering av e-post
- Hämtning och borttagning av personal
- Automatisk borttagning av bildfil om personalposten inte sparas

---

## 🧰 Tekniker

- Node.js + Express
- MongoDB + Mongoose
- Multer (för filuppladdningar)
- REST API

---

## 📁 Projektstruktur

```
/images         ← uppladdade bilder sparas här
/models/Staff.js← Mongoose-modell
/routes/staff.js← API-rutter
server.js       ← startfil
```

---

## 🛠️ Installation

1. **Klona projektet:**

```bash
git clone https://github.com/dittnamn/personal-api.git
cd personal-api
```

2. **Installera beroenden:**

```bash
npm install
```

3. **Starta MongoDB** (lokalt eller via t.ex. MongoDB Atlas)

4. **Skapa `.env` eller konfigurera din anslutning i `server.js`:**
Döp om .env-sample -> .env - och fyll i anslutningssträng för MongoDb


1. **Starta servern:**

```bash
node server.js
```

---

## 🔄 API-rutter

### ➕ Skapa personal

`POST /api/staff`  
Content-Type: `multipart/form-data`

**Fält:**
- `name` (text)
- `email` (text)
- `image` (fil) – endast `.jpeg`, `.png`, `.webp` tillåts

**Svar:**
```json
{
  "_id": "...",
  "name": "Emma",
  "email": "emma@example.com",
  "image": "images/1682628862030-profil.jpg"
}
```

---

### 📄 Hämta all personal

`GET /api/staff`

---

### 👤 Hämta en person

`GET /api/staff/:id`

---

### ❌ Radera personal

`DELETE /api/staff/:id`

> **Tips:** Lägg gärna till att även ta bort bildfilen från `images/` när personalen raderas.

---

## 🔒 Validering

- E-post måste vara unik
- Alla fält (`name`, `email`, `image`) är obligatoriska
- Endast bilder av typen `.jpeg`, `.png`, `.webp` tillåts

---

## 📌 Att förbättra

- Lägg till uppdateringsfunktion (PUT/PATCH)
- Validering av e-postformat
- Begränsa filstorlek (t.ex. max 2MB)
- Frontend för uppladdning

---

## 🧑‍💻 Av

Mattias Dahlgren  
[mattias.dahlgren@miun.se](mailto:mattias.dahlgren@student.miun.se)

