# Yemot Lampline

גרסת התחלה עצמאית המותאמת ל־Yemot HaMashiach ול־Vercel. הפרויקט מספק נקודת כניסה של IVR ומחבר אותה למנוע שיחה מבוסס API תואם OpenAI.

## פריסה ב־Vercel

1. ייבא את המאגר הזה ל־Vercel.
2. הגדר את משתני הסביבה:
   - `OPENAI_API_KEY` — מפתח API של ספק תואם OpenAI.
   - `OPENAI_MODEL` — אופציונלי; ברירת מחדל `gpt-4o-mini`.
   - `OPENAI_BASE_URL` — אופציונלי; ברירת מחדל `https://api.openai.com/v1`.
3. בצע Deploy.
4. כתובת ה־IVR תהיה: `https://YOUR-PROJECT.vercel.app/api/yemot`.
   קיימת גם כתובת מקוצרת: `/yemot`.

בדיקת תקינות:
`GET /api/yemot?health=1`

## חיבור לימות

הגדר בשלוחת ימות קריאת API מסוג POST לכתובת:
`https://YOUR-PROJECT.vercel.app/api/yemot`

הקוד מקבל פרמטרים נפוצים כגון `ApiCallId`, `ApiPhone`, `ApiExtension`, `Digits` וכן שדות טקסט כמו `text` או `question`.

> חשוב: פורמט הפקודות המדויק של ימות עשוי להשתנות לפי סוג השלוחה והגדרות ההשמעה/הקלט. יש לבצע בדיקת שיחה אמיתית ולכוון את מחרוזת `read=` בהתאם להגדרת השלוחה שלך.

## מבנה

- `api/yemot.js` — נקודת הכניסה לימות.
- `lib/agent.js` — מנוע שיחה מול ספק AI.
- `vercel.json` — הגדרות ניתוב Vercel.

## מגבלות הגרסה הראשונה

- פונקציות Vercel הן חסרות־מצב; אין כאן עדיין זיכרון שיחה מתמשך בין בקשות.
- זיהוי דיבור, TTS חיצוני, כלים, מאגר ידע וממשק ניהול הם שלבים להמשך.
- אין כאן העתקה של מנועי האודיו, SIP או שירותי Docker של Lampline.

## מקור ורישוי

הפרויקט הוא מתאם עצמאי ל־Yemot, ולא העתק של Lampline. רעיונות ארכיטקטוניים נבדקו מול המאגר [C4rohan/Lampline](https://github.com/C4rohan/Lampline), המופץ ברישיון Apache-2.0. אם יועתקו בעתיד קבצים או קטעי קוד מהפרויקט המקורי, יש לשמר את הודעות הרישוי והייחוס הנדרשות.
