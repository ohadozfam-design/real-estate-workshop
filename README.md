# סדנת נדל״ן בארה״ב — דף נחיתה

דף נחיתה בסגנון Direct-Response (Alex Hormozi) לסדנת לייב בזום. בנוי RTL מלא, Mobile-First, עם CTA דביק במובייל ו-Order Bump אינטראקטיבי.

## סטאק
- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (פלטת dark-slate/navy + זהב/אמרלד — מוגדרת ב-`tailwind.config.js`)
- **Framer Motion** — מיקרו-אנימציות וגלילה
- **lucide-react** — אייקונים
- גופן **Assistant** (Google Fonts, משקלים 300/400/600/700/800, נטען ב-`index.html`)

## הרצה
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # בנייה לפרודקשן (dist/)
npm run preview  # תצוגה מקדימה של הבנייה
```

## מבנה הרכיבים (`src/components/`)
| רכיב | תיאור |
|------|-------|
| `HeroSection.tsx` | כותרת, באולטים, כרטיס אירוע + CTA ראשי |
| `LogisticsSection.tsx` | 4 כרטיסי לוגיסטיקה + תיבת אחריות |
| `TreasureMap.tsx` | ציר 4 התחנות (מפת אוצר) + באנר היעד |
| `InstructorSection.tsx` | פרופיל המנחה אוהד עוז |
| `ValueStack.tsx` | פירוק ערך הבונוסים ($888 → $97) |
| `OrderBumpCheckout.tsx` | צ'קאאוט עם Order Bump אינטראקטיבי ($97 ⇄ $124) |
| `StickyMobileCTA.tsx` | CTA דביק בתחתית המובייל |

## מה צריך להחליף לפני עלייה לאוויר
כל הטקסטים הניתנים לעריכה מרוכזים ב-`src/lib/site.ts`:
- `eventDatePlaceholder` — `[תאריך הסדנה]`
- `eventTimePlaceholder` — `[שעת התחלה – שעת סיום]`
- `PRICING` — מחירים (בסיס $97, Order Bump $27).

בנוסף:
- **תמונת OG לשיתוף** — להוסיף `public/images/og-cover.jpg` (1200×630) לתצוגה מקדימה בוואטסאפ/פייסבוק (מקושר מ-`index.html`).
- **תמונת המנחה** — נטענת מ-`public/images/instructor.jpg` (עם fallback אוטומטי למונוגרם אם הקובץ חסר).

## תשלומים — Stripe Checkout
מפתחות ה-Stripe נטענים מ-`.env` (ראו `.env.example`). המפתח הסודי נקרא **בצד שרת בלבד** ולעולם לא נכנס ל-bundle של הדפדפן.

- **מפתח סודי (`STRIPE_SECRET_KEY`)** — משמש ליצירת Checkout Session.
- **נקודת הקצה** — `POST /api/create-checkout-session` עם `{ hasOrderBump: boolean }`, מחזירה `{ url }` ומפנה את המשתמש ל-Stripe.
- **פיתוח (`npm run dev`)** — מטופל ע"י middleware ב-`vite.config.ts`.
- **פרודקשן** — פונקציית serverless ב-`api/create-checkout-session.ts` (Vercel/Netlify). שתי הסביבות חולקות את `server/lineItems.ts` (מחיר הכרטיס $97 וה-Order Bump $27 מוגדרים בצד שרת בלבד).
- הגדירו `STRIPE_SECRET_KEY` ב-Environment Variables של סביבת הפרודקשן (לא מ-`.env`, שאינו נכנס ל-git).

> הערה: הדף הוא תוכן חינוכי-פרקטי בלבד ואינו ייעוץ השקעות/מס/משפטי. אין בו הבטחות תשואה מספריות — שמור על כך גם בעדכונים עתידיים.
