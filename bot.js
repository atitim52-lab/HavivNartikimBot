import { useState, useEffect, useCallback, useMemo } from "react";

const C = {
  navy:"#0F1B2D",mid:"#162236",light:"#1E3050",
  amber:"#F5A623",green:"#2ECC71",red:"#E74C3C",redDim:"#C0392B",
  yellow:"#F39C12",text:"#E8EDF4",muted:"#7A8FA6",border:"#263550",
};

const load=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null}catch{return null}};
const save=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v))}catch{}};

const LEAD=90;
const BASE_MODELS=[{"id":1,"name":"3014 אפור","sku":"3014","category":"נרתיקים רכים","description":"קטיפה+PVC סגירת קפיץ","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":2,"name":"3014 בורדו","sku":"3014","category":"נרתיקים רכים","description":"קטיפה+PVC סגירת קפיץ","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":3,"name":"3014 כחול","sku":"3014","category":"נרתיקים רכים","description":"קטיפה+PVC סגירת קפיץ","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":4,"name":"3014 שחור","sku":"3014","category":"נרתיקים רכים","description":"קטיפה+PVC סגירת קפיץ","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":5,"name":"3018 בורדו","sku":"3018","category":"נרתיקים רכים","description":"נרתיק רך קטן לחצן","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":6,"name":"3018 שחור","sku":"3018","category":"נרתיקים רכים","description":"נרתיק רך קטן לחצן","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":7,"name":"3018C שחור","sku":"3018C","category":"נרתיקים רכים","description":"נרתיק קטיפה קומפקטי","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":8,"name":"3018C כחול","sku":"3018C","category":"נרתיקים רכים","description":"נרתיק קטיפה קומפקטי","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":9,"name":"3018C בורדו","sku":"3018C","category":"נרתיקים רכים","description":"נרתיק קטיפה קומפקטי","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":10,"name":"3028 בורדו","sku":"3028","category":"נרתיקים רכים","description":"נרתיק רך בינוני לחצן","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":11,"name":"3028 שחור","sku":"3028","category":"נרתיקים רכים","description":"נרתיק רך בינוני לחצן","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":12,"name":"3028C שחור","sku":"3028C","category":"נרתיקים רכים","description":"נרתיק בד קומפקטי","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":13,"name":"3300 שחור","sku":"3300","category":"נרתיקים רכים","description":"מיקרופייבר עם כיס פנימי","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":14,"name":"3300 אפור","sku":"3300","category":"נרתיקים רכים","description":"מיקרופייבר עם כיס פנימי","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":15,"name":"3300 נייבי","sku":"3300","category":"נרתיקים רכים","description":"מיקרופייבר עם כיס פנימי","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":16,"name":"3300 בורדו","sku":"3300","category":"נרתיקים רכים","description":"מיקרופייבר עם כיס פנימי","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":17,"name":"3300 חום","sku":"3300","category":"נרתיקים רכים","description":"מיקרופייבר עם כיס פנימי","color":"חום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":18,"name":"3300C שחור","sku":"3300C","category":"נרתיקים רכים","description":"מיקרופייבר קומפקטי","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":19,"name":"3300C אפור","sku":"3300C","category":"נרתיקים רכים","description":"מיקרופייבר קומפקטי","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":20,"name":"3300C נייבי","sku":"3300C","category":"נרתיקים רכים","description":"מיקרופייבר קומפקטי","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":21,"name":"3500 שחור","sku":"3500","category":"נרתיקים רכים","description":"גב קשיח פנים קטיפה","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":22,"name":"3500 אפור","sku":"3500","category":"נרתיקים רכים","description":"גב קשיח פנים קטיפה","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":23,"name":"3500 נייבי","sku":"3500","category":"נרתיקים רכים","description":"גב קשיח פנים קטיפה","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":24,"name":"3500 בורדו","sku":"3500","category":"נרתיקים רכים","description":"גב קשיח פנים קטיפה","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":25,"name":"5089 אדום","sku":"5089","category":"נרתיקים רכים","description":"נרתיק רחב חצי חלק","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":26,"name":"5089 בורדו","sku":"5089","category":"נרתיקים רכים","description":"נרתיק רחב חצי חלק","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":27,"name":"5089 חום","sku":"5089","category":"נרתיקים רכים","description":"נרתיק רחב חצי חלק","color":"חום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":28,"name":"5089 ירוק","sku":"5089","category":"נרתיקים רכים","description":"נרתיק רחב חצי חלק","color":"ירוק","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":29,"name":"5089 כחול","sku":"5089","category":"נרתיקים רכים","description":"נרתיק רחב חצי חלק","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":30,"name":"5089 שחור","sku":"5089","category":"נרתיקים רכים","description":"נרתיק רחב חצי חלק","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":31,"name":"5110 שחור","sku":"5110","category":"נרתיקים רכים","description":"נרתיק רך מיוחד","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":32,"name":"5110 כחול","sku":"5110","category":"נרתיקים רכים","description":"נרתיק רך מיוחד","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":33,"name":"5110 בורדו","sku":"5110","category":"נרתיקים רכים","description":"נרתיק רך מיוחד","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":34,"name":"5300 שחור","sku":"5300","category":"נרתיקים רכים","description":"נרתיק פרמיום גדול","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":35,"name":"5300 אפור","sku":"5300","category":"נרתיקים רכים","description":"נרתיק פרמיום גדול","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":36,"name":"5300 נייבי","sku":"5300","category":"נרתיקים רכים","description":"נרתיק פרמיום גדול","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":37,"name":"8027 שחור","sku":"8027","category":"נרתיקים רכים","description":"נרתיק בד","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":38,"name":"8611 שחור","sku":"8611","category":"נרתיקים רכים","description":"נרתיק מסגרת מתכת גדול","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":39,"name":"8611 זהב","sku":"8611","category":"נרתיקים רכים","description":"נרתיק מסגרת מתכת גדול","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":40,"name":"8611 בורדו","sku":"8611","category":"נרתיקים רכים","description":"נרתיק מסגרת מתכת גדול","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":41,"name":"8811 Beige croco","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"Beige croco","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":42,"name":"8811 Black croco","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"Black croco","stock":600,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":43,"name":"8811 Brown croco","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"Brown croco","stock":600,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":44,"name":"8811 Purple croco","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"Purple croco","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":45,"name":"8811 Red croco","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"Red croco","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":46,"name":"8811 בורדו","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":47,"name":"8811 חום","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"חום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":48,"name":"8811 ירוק","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"ירוק","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":49,"name":"8811 כחול","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":50,"name":"8811 שחור","sku":"8811","category":"נרתיקים רכים","description":"נרתיק רחב קפיץ","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":51,"name":"8811F שחור","sku":"8811F","category":"נרתיקים רכים","description":"נרתיק קטיפה F","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":52,"name":"8811F נייבי","sku":"8811F","category":"נרתיקים רכים","description":"נרתיק קטיפה F","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":53,"name":"8811F בורדו","sku":"8811F","category":"נרתיקים רכים","description":"נרתיק קטיפה F","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":54,"name":"8811Z שחור","sku":"8811Z","category":"נרתיקים רכים","description":"נרתיק קומבו מגנט","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":55,"name":"8811Z נייבי","sku":"8811Z","category":"נרתיקים רכים","description":"נרתיק קומבו מגנט","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":56,"name":"8911 אדום","sku":"8911","category":"נרתיקים רכים","description":"נרתיק לבד מעטפה","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":57,"name":"8911 אפור","sku":"8911","category":"נרתיקים רכים","description":"נרתיק לבד מעטפה","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":58,"name":"8911 שחור","sku":"8911","category":"נרתיקים רכים","description":"נרתיק לבד מעטפה","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":59,"name":"1808 בורדו","sku":"1808","category":"קופסאות מתכת","description":"קופסת מתכת קטנה ציפוי PVC","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":60,"name":"1808 חום","sku":"1808","category":"קופסאות מתכת","description":"קופסת מתכת קטנה ציפוי PVC","color":"חום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":61,"name":"1808 ירוק","sku":"1808","category":"קופסאות מתכת","description":"קופסת מתכת קטנה ציפוי PVC","color":"ירוק","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":62,"name":"1808 כחול","sku":"1808","category":"קופסאות מתכת","description":"קופסת מתכת קטנה ציפוי PVC","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":63,"name":"1808 שחור","sku":"1808","category":"קופסאות מתכת","description":"קופסת מתכת קטנה ציפוי PVC","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":64,"name":"2022 שחור","sku":"2022","category":"קופסאות מתכת","description":"קופסת מתכת ציר פנים קטיפה","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":65,"name":"2022 כסף","sku":"2022","category":"קופסאות מתכת","description":"קופסת מתכת ציר פנים קטיפה","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":66,"name":"2022 זהב","sku":"2022","category":"קופסאות מתכת","description":"קופסת מתכת ציר פנים קטיפה","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":67,"name":"2022 אדום","sku":"2022","category":"קופסאות מתכת","description":"קופסת מתכת ציר פנים קטיפה","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":68,"name":"2022 כחול","sku":"2022","category":"קופסאות מתכת","description":"קופסת מתכת ציר פנים קטיפה","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":69,"name":"2040 שחור","sku":"2040","category":"קופסאות מתכת","description":"אלומיניום מוברש מאט","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":70,"name":"2040 כסף","sku":"2040","category":"קופסאות מתכת","description":"אלומיניום מוברש מאט","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":71,"name":"2040 זהב","sku":"2040","category":"קופסאות מתכת","description":"אלומיניום מוברש מאט","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":72,"name":"2044 שחור","sku":"2044","category":"קופסאות מתכת","description":"קופסת מתכת סגירת לחיצה","color":"שחור","stock":300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":73,"name":"2044 כסף","sku":"2044","category":"קופסאות מתכת","description":"קופסת מתכת סגירת לחיצה","color":"כסף","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":74,"name":"2044 זהב","sku":"2044","category":"קופסאות מתכת","description":"קופסת מתכת סגירת לחיצה","color":"זהב","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":75,"name":"2044 אדום","sku":"2044","category":"קופסאות מתכת","description":"קופסת מתכת סגירת לחיצה","color":"אדום","stock":1500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":76,"name":"2044 כחול","sku":"2044","category":"קופסאות מתכת","description":"קופסת מתכת סגירת לחיצה","color":"כחול","stock":1300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":77,"name":"2044 בורדו","sku":"2044","category":"קופסאות מתכת","description":"קופסת מתכת סגירת לחיצה","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":78,"name":"2044 חדש שחור","sku":"2044 חדש","category":"קופסאות מתכת","description":"קופסת מתכת עיצוב מעודכן","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":79,"name":"2044 חדש כסף","sku":"2044 חדש","category":"קופסאות מתכת","description":"קופסת מתכת עיצוב מעודכן","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":80,"name":"2044 חדש זהב","sku":"2044 חדש","category":"קופסאות מתכת","description":"קופסת מתכת עיצוב מעודכן","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":81,"name":"2052 שחור","sku":"2052","category":"קופסאות מתכת","description":"קופסת מתנה יוקרתית קטיפה","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":82,"name":"2052 זהב","sku":"2052","category":"קופסאות מתכת","description":"קופסת מתנה יוקרתית קטיפה","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":83,"name":"2072 שחור","sku":"2072","category":"קופסאות מתכת","description":"קופסת מתכת חישוק עגול","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":84,"name":"2072 כסף","sku":"2072","category":"קופסאות מתכת","description":"קופסת מתכת חישוק עגול","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":85,"name":"2072 אדום","sku":"2072","category":"קופסאות מתכת","description":"קופסת מתכת חישוק עגול","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":86,"name":"2072 כחול","sku":"2072","category":"קופסאות מתכת","description":"קופסת מתכת חישוק עגול","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":87,"name":"2094 שחור","sku":"2094","category":"קופסאות מתכת","description":"קופסת מתכת סגירת מגנט","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":88,"name":"2094 כסף","sku":"2094","category":"קופסאות מתכת","description":"קופסת מתכת סגירת מגנט","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":89,"name":"2094 זהב","sku":"2094","category":"קופסאות מתכת","description":"קופסת מתכת סגירת מגנט","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":90,"name":"2094 רוז גולד","sku":"2094","category":"קופסאות מתכת","description":"קופסת מתכת סגירת מגנט","color":"רוז גולד","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":91,"name":"2130 שחור","sku":"2130","category":"קופסאות מתכת","description":"קופסת מתכת ייחודית","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":92,"name":"2130 כסף","sku":"2130","category":"קופסאות מתכת","description":"קופסת מתכת ייחודית","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":93,"name":"2213 שחור","sku":"2213","category":"קופסאות מתכת","description":"קופסת מתכת בינונית","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":94,"name":"2213 כסף","sku":"2213","category":"קופסאות מתכת","description":"קופסת מתכת בינונית","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":95,"name":"2213 זהב","sku":"2213","category":"קופסאות מתכת","description":"קופסת מתכת בינונית","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":96,"name":"2228 שחור","sku":"2228","category":"קופסאות מתכת","description":"קופסת מתכת עם פסים","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":97,"name":"2228 כסף","sku":"2228","category":"קופסאות מתכת","description":"קופסת מתכת עם פסים","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":98,"name":"2228 זהב","sku":"2228","category":"קופסאות מתכת","description":"קופסת מתכת עם פסים","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":99,"name":"2228 אדום","sku":"2228","category":"קופסאות מתכת","description":"קופסת מתכת עם פסים","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":100,"name":"5707 שחור","sku":"5707","category":"קופסאות מתכת","description":"קופסת מתכת מחוסמת","color":"שחור","stock":1000,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":101,"name":"5707 כסף","sku":"5707","category":"קופסאות מתכת","description":"קופסת מתכת מחוסמת","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":102,"name":"5707 זהב","sku":"5707","category":"קופסאות מתכת","description":"קופסת מתכת מחוסמת","color":"זהב","stock":1500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":103,"name":"5707 כחול","sku":"5707","category":"קופסאות מתכת","description":"קופסת מתכת מחוסמת","color":"כחול","stock":300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":104,"name":"5707 אדום","sku":"5707","category":"קופסאות מתכת","description":"קופסת מתכת מחוסמת","color":"אדום","stock":200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":105,"name":"5707F שחור","sku":"5707F","category":"קופסאות מתכת","description":"קופסת מתכת סדרת F","color":"שחור","stock":1400,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":106,"name":"5707F כסף","sku":"5707F","category":"קופסאות מתכת","description":"קופסת מתכת סדרת F","color":"כסף","stock":300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":107,"name":"5707F זהב","sku":"5707F","category":"קופסאות מתכת","description":"קופסת מתכת סדרת F","color":"זהב","stock":1000,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":108,"name":"5707G שחור","sku":"5707G","category":"קופסאות מתכת","description":"קופסת מתכת פרמיום חדש","color":"שחור","stock":700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":109,"name":"5707G כסף","sku":"5707G","category":"קופסאות מתכת","description":"קופסת מתכת פרמיום חדש","color":"כסף","stock":1500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":110,"name":"5707G זהב","sku":"5707G","category":"קופסאות מתכת","description":"קופסת מתכת פרמיום חדש","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":111,"name":"7505 שחור","sku":"7505","category":"קופסאות מתכת","description":"קופסת מתכת מרובעת","color":"שחור","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":112,"name":"7505 כסף","sku":"7505","category":"קופסאות מתכת","description":"קופסת מתכת מרובעת","color":"כסף","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":113,"name":"7531 שחור","sku":"7531","category":"קופסאות מתכת","description":"קופסת מתכת ייחודית","color":"שחור","stock":900,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":114,"name":"7531 כסף","sku":"7531","category":"קופסאות מתכת","description":"קופסת מתכת ייחודית","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":115,"name":"7531 זהב","sku":"7531","category":"קופסאות מתכת","description":"קופסת מתכת ייחודית","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":116,"name":"7581 Wooden Red","sku":"7581","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי PVC דוגמה","color":"Wooden Red","stock":1500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":117,"name":"7581 אפור","sku":"7581","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי PVC דוגמה","color":"אפור","stock":1500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":118,"name":"7581 ורוד","sku":"7581","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי PVC דוגמה","color":"ורוד","stock":800,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":119,"name":"7581 שחור","sku":"7581","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי PVC דוגמה","color":"שחור","stock":700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":120,"name":"7582 אדום","sku":"7582","category":"קופסאות מתכת","description":"קופסת מתכת גדולה פסים","color":"אדום","stock":1300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":121,"name":"7582 אפור","sku":"7582","category":"קופסאות מתכת","description":"קופסת מתכת גדולה פסים","color":"אפור","stock":1400,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":122,"name":"7582 אפור בהיר","sku":"7582","category":"קופסאות מתכת","description":"קופסת מתכת גדולה פסים","color":"אפור בהיר","stock":700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":123,"name":"7582 כחול","sku":"7582","category":"קופסאות מתכת","description":"קופסת מתכת גדולה פסים","color":"כחול","stock":1500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":124,"name":"7582 סגול","sku":"7582","category":"קופסאות מתכת","description":"קופסת מתכת גדולה פסים","color":"סגול","stock":900,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":125,"name":"7582 שחור","sku":"7582","category":"קופסאות מתכת","description":"קופסת מתכת גדולה פסים","color":"שחור","stock":1400,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":126,"name":"8003 אדום","sku":"8003","category":"קופסאות מתכת","description":"חצי-קשיח ללא קליפס","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":127,"name":"8003 שחור","sku":"8003","category":"קופסאות מתכת","description":"חצי-קשיח ללא קליפס","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":128,"name":"8003C אדום","sku":"8003C","category":"קופסאות מתכת","description":"חצי-קשיח עם קליפס","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":129,"name":"8003C שחור","sku":"8003C","category":"קופסאות מתכת","description":"חצי-קשיח עם קליפס","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":130,"name":"8011 קרם","sku":"8011","category":"קופסאות מתכת","description":"קופסת מתכת פס כרום","color":"קרם","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":131,"name":"8011 בורדו","sku":"8011","category":"קופסאות מתכת","description":"קופסת מתכת פס כרום","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":132,"name":"8011 כחול","sku":"8011","category":"קופסאות מתכת","description":"קופסת מתכת פס כרום","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":133,"name":"8011 שחור","sku":"8011","category":"קופסאות מתכת","description":"קופסת מתכת פס כרום","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":134,"name":"8044 אדום מבריק","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"אדום מבריק","stock":600,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":135,"name":"8044 ורוד מבריק","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"ורוד מבריק","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":136,"name":"8044 כחול מבריק","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"כחול מבריק","stock":600,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":137,"name":"8044 כחול מט","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"כחול מט","stock":1400,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":138,"name":"8044 כחול מט קרבון","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"כחול מט קרבון","stock":800,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":139,"name":"8044 כתום מבריק","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"כתום מבריק","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":140,"name":"8044 שחור מבריק","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"שחור מבריק","stock":1100,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":141,"name":"8044 שחור מט","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"שחור מט","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":142,"name":"8044 שחור מט קרבון","sku":"8044","category":"קופסאות מתכת","description":"קופסת מתכת פתיחה קלה ציפוי PVC","color":"שחור מט קרבון","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":143,"name":"8053D שחור","sku":"8053D","category":"קופסאות מתכת","description":"קופסת מתכת דמוי עור","color":"שחור","stock":700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":144,"name":"8053D חום","sku":"8053D","category":"קופסאות מתכת","description":"קופסת מתכת דמוי עור","color":"חום","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":145,"name":"8053D בורדו","sku":"8053D","category":"קופסאות מתכת","description":"קופסת מתכת דמוי עור","color":"בורדו","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":146,"name":"8119 תכלת","sku":"8119","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי דמוי עור חדש","color":"תכלת","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":147,"name":"8119 ירוק בהיר","sku":"8119","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי דמוי עור חדש","color":"ירוק בהיר","stock":1700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":148,"name":"8119 כתום","sku":"8119","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי דמוי עור חדש","color":"כתום","stock":1700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":149,"name":"8119 שחור","sku":"8119","category":"קופסאות מתכת","description":"קופסת מתכת ציפוי דמוי עור חדש","color":"שחור","stock":2300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":150,"name":"8121 אפור","sku":"8121","category":"קופסאות מתכת","description":"קופסת מתכת דמוי עור חדש","color":"אפור","stock":300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":151,"name":"8121 כחול","sku":"8121","category":"קופסאות מתכת","description":"קופסת מתכת דמוי עור חדש","color":"כחול","stock":300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":152,"name":"8121 כתום","sku":"8121","category":"קופסאות מתכת","description":"קופסת מתכת דמוי עור חדש","color":"כתום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":153,"name":"8121 שחור","sku":"8121","category":"קופסאות מתכת","description":"קופסת מתכת דמוי עור חדש","color":"שחור","stock":700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":154,"name":"8193 אפור-תכלת","sku":"8193","category":"קופסאות מתכת","description":"קופסת מתכת פינות שבורות","color":"אפור-תכלת","stock":1300,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":155,"name":"8193 ירוק","sku":"8193","category":"קופסאות מתכת","description":"קופסת מתכת פינות שבורות","color":"ירוק","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":156,"name":"8193 סגול","sku":"8193","category":"קופסאות מתכת","description":"קופסת מתכת פינות שבורות","color":"סגול","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":157,"name":"8193 שחור","sku":"8193","category":"קופסאות מתכת","description":"קופסת מתכת פינות שבורות","color":"שחור","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":158,"name":"1032 שחור","sku":"1032","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בסיסית","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":159,"name":"1032 אפור","sku":"1032","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בסיסית","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":160,"name":"1032 כחול","sku":"1032","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בסיסית","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":161,"name":"1032 בורדו","sku":"1032","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בסיסית","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":162,"name":"1032P שחור","sku":"1032P","category":"קופסאות פלסטיק","description":"1032 עם ציר","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":163,"name":"1032P אפור","sku":"1032P","category":"קופסאות פלסטיק","description":"1032 עם ציר","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":164,"name":"1032P כחול","sku":"1032P","category":"קופסאות פלסטיק","description":"1032 עם ציר","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":165,"name":"2785 שחור","sku":"2785","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"שחור","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":166,"name":"2785 אפור","sku":"2785","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"אפור","stock":2400,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":167,"name":"2785 כחול","sku":"2785","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"כחול","stock":1500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":168,"name":"2785 בורדו","sku":"2785","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"בורדו","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":169,"name":"4252 אדום","sku":"4252","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מכסה חצי-שקוף","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":170,"name":"4252 כתום","sku":"4252","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מכסה חצי-שקוף","color":"כתום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":171,"name":"4252 שחור","sku":"4252","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מכסה חצי-שקוף","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":172,"name":"4252 תכלת","sku":"4252","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מכסה חצי-שקוף","color":"תכלת","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":173,"name":"6287 שחור","sku":"6287","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מיוחדת","color":"שחור","stock":900,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":174,"name":"6287 אפור","sku":"6287","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מיוחדת","color":"אפור","stock":700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":175,"name":"8065 בורדו","sku":"8065","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"בורדו","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":176,"name":"8065 ירוק","sku":"8065","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"ירוק","stock":800,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":177,"name":"8065 כחול","sku":"8065","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"כחול","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":178,"name":"8065 שחור","sku":"8065","category":"קופסאות פלסטיק","description":"קופסת פלסטיק בינונית","color":"שחור","stock":1000,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":179,"name":"8066 שחור","sku":"8066","category":"קופסאות פלסטיק","description":"קופסת פלסטיק גרסה B","color":"שחור","stock":1000,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":180,"name":"8066 אפור","sku":"8066","category":"קופסאות פלסטיק","description":"קופסת פלסטיק גרסה B","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":181,"name":"8066 נייבי","sku":"8066","category":"קופסאות פלסטיק","description":"קופסת פלסטיק גרסה B","color":"נייבי","stock":1400,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":182,"name":"8096 שחור","sku":"8096","category":"קופסאות פלסטיק","description":"קופסת פלסטיק 8096","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":183,"name":"8096 אפור","sku":"8096","category":"קופסאות פלסטיק","description":"קופסת פלסטיק 8096","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":184,"name":"8096 כחול","sku":"8096","category":"קופסאות פלסטיק","description":"קופסת פלסטיק 8096","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":185,"name":"8360 שחור","sku":"8360","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מוארכת","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":186,"name":"8360 אפור","sku":"8360","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מוארכת","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":187,"name":"8360 נייבי","sku":"8360","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מוארכת","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":188,"name":"8360 בורדו","sku":"8360","category":"קופסאות פלסטיק","description":"קופסת פלסטיק מוארכת","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":189,"name":"8903 שחור","sku":"8903","category":"קופסאות פלסטיק","description":"קופסת TR-90 חדש","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":190,"name":"8903 אפור","sku":"8903","category":"קופסאות פלסטיק","description":"קופסת TR-90 חדש","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":191,"name":"8903 נייבי","sku":"8903","category":"קופסאות פלסטיק","description":"קופסת TR-90 חדש","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":192,"name":"8903 בורדו","sku":"8903","category":"קופסאות פלסטיק","description":"קופסת TR-90 חדש","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":193,"name":"8903 כחול","sku":"8903","category":"קופסאות פלסטיק","description":"קופסת TR-90 חדש","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":194,"name":"8930 בורדו","sku":"8930","category":"קופסאות פלסטיק","description":"קופסת פלסטיק XL שמש","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":195,"name":"8930 כחול","sku":"8930","category":"קופסאות פלסטיק","description":"קופסת פלסטיק XL שמש","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":196,"name":"8930 שחור","sku":"8930","category":"קופסאות פלסטיק","description":"קופסת פלסטיק XL שמש","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":197,"name":"1017 שחור","sku":"1017","category":"קופסאות מיוחדות","description":"קופסה מיוחדת סגירה ייחודית","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":198,"name":"1017 כחול","sku":"1017","category":"קופסאות מיוחדות","description":"קופסה מיוחדת סגירה ייחודית","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":199,"name":"1017 בורדו","sku":"1017","category":"קופסאות מיוחדות","description":"קופסה מיוחדת סגירה ייחודית","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":200,"name":"4007 שחור","sku":"4007","category":"קופסאות מיוחדות","description":"קופסת EVA רוכסן","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":201,"name":"4007 אפור","sku":"4007","category":"קופסאות מיוחדות","description":"קופסת EVA רוכסן","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":202,"name":"4007 כחול","sku":"4007","category":"קופסאות מיוחדות","description":"קופסת EVA רוכסן","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":203,"name":"6900 שחור","sku":"6900","category":"קופסאות מיוחדות","description":"קופסה עם שרוך","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":204,"name":"6900 אפור","sku":"6900","category":"קופסאות מיוחדות","description":"קופסה עם שרוך","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":205,"name":"6900 נייבי","sku":"6900","category":"קופסאות מיוחדות","description":"קופסה עם שרוך","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":206,"name":"8903 קשיח שחור","sku":"8903 קשיח","category":"קופסאות מיוחדות","description":"TR-90 קשיחה חדש","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":207,"name":"8903 קשיח אפור","sku":"8903 קשיח","category":"קופסאות מיוחדות","description":"TR-90 קשיחה חדש","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":208,"name":"8903 קשיח נייבי","sku":"8903 קשיח","category":"קופסאות מיוחדות","description":"TR-90 קשיחה חדש","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":209,"name":"8903 קשיח בורדו","sku":"8903 קשיח","category":"קופסאות מיוחדות","description":"TR-90 קשיחה חדש","color":"בורדו","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":210,"name":"8903 קשיח כחול","sku":"8903 קשיח","category":"קופסאות מיוחדות","description":"TR-90 קשיחה חדש","color":"כחול","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":211,"name":"9898 שחור","sku":"9898","category":"קופסאות מיוחדות","description":"קופסה מיוחדת מגן","color":"שחור","stock":500,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":212,"name":"9898 אפור","sku":"9898","category":"קופסאות מיוחדות","description":"קופסה מיוחדת מגן","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":213,"name":"9000 לפי הזמנה","sku":"9000","category":"מטליות","description":"מטלית מיקרופייבר סטנדרט","color":"לפי הזמנה","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":214,"name":"9100 לפי הזמנה","sku":"9100","category":"מטליות","description":"מטלית עם הדפסה","color":"לפי הזמנה","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":215,"name":"9300 לפי הזמנה","sku":"9300","category":"מטליות","description":"מטלית פרמיום עם כיס","color":"לפי הזמנה","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":216,"name":"9400 לפי הזמנה","sku":"9400","category":"מטליות","description":"מטלית גדולה 20x20","color":"לפי הזמנה","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":217,"name":"9600 לבן","sku":"9600","category":"מטליות","description":"מטלית מונעת אדים","color":"לבן","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":218,"name":"9800 לפי הזמנה","sku":"9800","category":"מטליות","description":"מטלית עם קופסת פלסטיק","color":"לפי הזמנה","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":219,"name":"9900 לפי הזמנה","sku":"9900","category":"מטליות","description":"מטלית במארז אישי","color":"לפי הזמנה","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":220,"name":"הדפסה שחור-לבן לבן+שחור","sku":"הדפסה שחור-לבן","category":"מטליות","description":"מטלית הדפסה שחורה על לבן","color":"לבן+שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":221,"name":"7000 שחור","sku":"7000","category":"שקיות","description":"שקית אל-בד עם לוגו","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":222,"name":"7000 נייבי","sku":"7000","category":"שקיות","description":"שקית אל-בד עם לוגו","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":223,"name":"7000 אפור","sku":"7000","category":"שקיות","description":"שקית אל-בד עם לוגו","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":224,"name":"7000 בז","sku":"7000","category":"שקיות","description":"שקית אל-בד עם לוגו","color":"בז","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":225,"name":"7001 שחור","sku":"7001","category":"שקיות","description":"שקית אל-בד עם חוטים","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":226,"name":"7001 נייבי","sku":"7001","category":"שקיות","description":"שקית אל-בד עם חוטים","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":227,"name":"7001 אפור","sku":"7001","category":"שקיות","description":"שקית אל-בד עם חוטים","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":228,"name":"7001 בז","sku":"7001","category":"שקיות","description":"שקית אל-בד עם חוטים","color":"בז","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":229,"name":"7001 אדום","sku":"7001","category":"שקיות","description":"שקית אל-בד עם חוטים","color":"אדום","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":230,"name":"7001/7002 שחור","sku":"7001/7002","category":"שקיות","description":"שקית אל-בד הלחמות חדש","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":231,"name":"7001/7002 נייבי","sku":"7001/7002","category":"שקיות","description":"שקית אל-בד הלחמות חדש","color":"נייבי","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":232,"name":"7001/7002 אפור","sku":"7001/7002","category":"שקיות","description":"שקית אל-בד הלחמות חדש","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":233,"name":"7001/7002 בז","sku":"7001/7002","category":"שקיות","description":"שקית אל-בד הלחמות חדש","color":"בז","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":234,"name":"Paper Bags לבן","sku":"Paper Bags","category":"שקיות","description":"שקית נייר יוקרתית","color":"לבן","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":235,"name":"Paper Bags שחור","sku":"Paper Bags","category":"שקיות","description":"שקית נייר יוקרתית","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":236,"name":"Paper Bags קראפט","sku":"Paper Bags","category":"שקיות","description":"שקית נייר יוקרתית","color":"קראפט","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":237,"name":"8000 שחור","sku":"8000","category":"שרוכים","description":"שרוך משקפיים סטנדרט","color":"שחור","stock":700,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":238,"name":"8000 חום","sku":"8000","category":"שרוכים","description":"שרוך משקפיים סטנדרט","color":"חום","stock":1200,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":239,"name":"8000 שקוף","sku":"8000","category":"שרוכים","description":"שרוך משקפיים סטנדרט","color":"שקוף","stock":800,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":240,"name":"8000 צבעוני","sku":"8000","category":"שרוכים","description":"שרוך משקפיים סטנדרט","color":"צבעוני","stock":800,"minStock":500,"dailyAvg":2,"lastUpdate":"2026-06-25T00:00:00.000Z"},{"id":241,"name":"8614 זהב","sku":"8614","category":"שרוכים","description":"שרשרת קישוט למשקפיים","color":"זהב","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":242,"name":"8614 כסף","sku":"8614","category":"שרוכים","description":"שרשרת קישוט למשקפיים","color":"כסף","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":243,"name":"5000","sku":"5000","category":"שונות","description":"ספריי ניקוי","color":"—","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":244,"name":"6000 שחור","sku":"6000","category":"שונות","description":"תופסן משקפיים לרכב","color":"שחור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null},{"id":245,"name":"6000 אפור","sku":"6000","category":"שונות","description":"תופסן משקפיים לרכב","color":"אפור","stock":0,"minStock":500,"dailyAvg":2,"lastUpdate":null}];

const daysLeft=(s,a)=>a>0?Math.floor(s/a):999;
const alertLevel=(s,m,d)=>{if(s<=0)return"out";if(s<m||d<=LEAD)return"critical";if(d<=LEAD+30)return"warning";return"ok";};
const todayStr=()=>new Date().toISOString().split("T")[0];
const fmtTime=ts=>{
  if(!ts)return null;
  const d=new Date(ts);
  const t=d.toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"});
  const dt=d.toLocaleDateString("he-IL",{day:"numeric",month:"numeric"});
  return d.toDateString()===new Date().toDateString()?`היום ${t}`:`${dt} ${t}`;
};

const CAT_ICON={"נרתיקים רכים":"👜","קופסאות מתכת":"📦","קופסאות פלסטיק":"🗂","קופסאות מיוחדות":"✨","מטליות":"🧹","שקיות":"🛍","שרוכים":"🔗","שונות":"🔧"};

const BADGE={
  ok:{bg:C.green,t:"✅ תקין"},
  warning:{bg:C.yellow,t:"🟡 שקול"},
  critical:{bg:C.red,t:"🔴 הזמן!"},
  out:{bg:"#555",t:"⬛ אזל"}
};

const TELEGRAM_CODE=`#!/usr/bin/env node
// npm install node-telegram-bot-api
// node bot.js
const TelegramBot=require("node-telegram-bot-api");
const fs=require("fs");
const TOKEN="8927766030:AAEhjDCM1KvWE_OgaLwJlkhXmmOKnx6CSkk
";
const ADMIN_CHAT_ID="-5498872165";
const FILE="inventory.json";
const LEAD=90;
const load=()=>fs.existsSync(FILE)?JSON.parse(fs.readFileSync(FILE,"utf8")):{models:[],history:[],schedule:{hour:18,minute:0}};
const persist=d=>fs.writeFileSync(FILE,JSON.stringify(d,null,2));
const bot=new TelegramBot(TOKEN,{polling:true});
const inv=load();
const S={};

bot.onText(/\\/start/,msg=>{
  bot.sendMessage(msg.chat.id,\`🕶️ *מערכת מלאי חביב שיווק*\\n\\n📦 /stock — כל המלאי\\n📋 /cat — לפי קטגוריה\\n📝 /report — ספירת סוף יום\\n✏️ /edit — ערוך דגם\\n🔍 /find שם — חפש דגם\\n🛠 /set שם כמות — עדכון מהיר\\n➕ /add שם מינ — הוסף דגם\\n🗑 /del שם — מחק דגם\\n⚠️ /alert — התראות\\n📊 /history — 7 ימים\\n🕐 /settime HH:MM\`,{parse_mode:"Markdown"});
});

bot.onText(/\\/stock/,msg=>{
  const lines=inv.models.slice(0,50).map(m=>{
    const d=m.dailyAvg>0?Math.floor(m.stock/m.dailyAvg):999;
    const ic=m.stock<m.minStock||d<=LEAD?"🔴":d<=LEAD+30?"🟡":"🟢";
    const t=m.lastUpdate?new Date(m.lastUpdate).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"}):"—";
    return \`\${ic} *\${m.name}* | \${m.stock} יח' | ~\${d} ימים | 🕐\${t}\`;
  }).join("\\n");
  bot.sendMessage(msg.chat.id,"📦 *מלאי (50 ראשונים):*\\n\\n"+lines+(inv.models.length>50?"\\n\\n...ועוד "+(inv.models.length-50)+" דגמים. השתמש /find לחיפוש":""),{parse_mode:"Markdown"});
});

bot.onText(/\\/cat/,msg=>{
  const cats=[...new Set(inv.models.map(m=>m.category).filter(Boolean))];
  let text="📋 *קטגוריות:*\\n\\n";
  cats.forEach((c,i)=>{text+=\`\${i+1}. \${c}\\n\`;});
  text+="\\nשלח /cat [שם] לפירוט, למשל: /cat נרתיקים רכים";
  bot.sendMessage(msg.chat.id,text,{parse_mode:"Markdown"});
});

bot.onText(/\\/cat (.+)/,msg=>{
  const [,q]=msg.text.match(/\\/cat (.+)/);
  const ms=inv.models.filter(m=>m.category&&m.category.includes(q.trim()));
  if(!ms.length)return bot.sendMessage(msg.chat.id,"❌ קטגוריה לא נמצאה");
  let text=\`📦 *\${q}* (\${ms.length} דגמים):\\n\\n\`;
  ms.forEach(m=>{
    const d=m.dailyAvg>0?Math.floor(m.stock/m.dailyAvg):999;
    const ic=m.stock<m.minStock||d<=LEAD?"🔴":d<=LEAD+30?"🟡":"🟢";
    text+=\`\${ic} *\${m.name}* — \${m.stock} יח'\\n\`;
  });
  bot.sendMessage(msg.chat.id,text,{parse_mode:"Markdown"});
});

bot.onText(/\\/find (.+)/,msg=>{
  const [,q]=msg.text.match(/\\/find (.+)/);
  const ms=inv.models.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())||(m.sku&&m.sku.toLowerCase().includes(q.toLowerCase())));
  if(!ms.length)return bot.sendMessage(msg.chat.id,\`❌ לא נמצא "\${q}"\`);
  let text=\`🔍 *תוצאות "\${q}":*\\n\\n\`;
  ms.forEach(m=>{
    const d=m.dailyAvg>0?Math.floor(m.stock/m.dailyAvg):999;
    const ic=m.stock<m.minStock||d<=LEAD?"🔴":d<=LEAD+30?"🟡":"🟢";
    const t=m.lastUpdate?new Date(m.lastUpdate).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"}):"—";
    text+=\`\${ic} *\${m.name}* — \${m.stock} יח' | ~\${d} ימים | 🕐\${t}\\n\`;
  });
  bot.sendMessage(msg.chat.id,text,{parse_mode:"Markdown"});
});

bot.onText(/\\/set (.+) (\\d+)/,msg=>{
  const [,name,amt]=msg.text.match(/\\/set (.+) (\\d+)/);
  const ms=inv.models.filter(m=>m.name.toLowerCase().includes(name.toLowerCase())||(m.sku&&m.sku.toLowerCase().includes(name.toLowerCase())));
  if(!ms.length)return bot.sendMessage(msg.chat.id,\`❌ לא נמצא "\${name}"\`);
  if(ms.length>1){
    let text=\`⚠️ נמצאו \${ms.length} דגמים, היה ספציפי יותר:\\n\`;
    ms.forEach((m,i)=>text+=\`\${i+1}. \${m.name}\\n\`);
    return bot.sendMessage(msg.chat.id,text);
  }
  const m=ms[0]; const old=m.stock; m.stock=parseInt(amt); m.lastUpdate=new Date().toISOString();
  persist(inv);
  bot.sendMessage(msg.chat.id,\`✅ *\${m.name}*\\n\${old} ← *\${amt}* יח'\\n🕐 \${new Date().toLocaleTimeString("he-IL")}\`,{parse_mode:"Markdown"});
});

bot.onText(/\\/alert/,msg=>{
  let text="⚠️ *התראות:*\\n\\n";let n=0;
  inv.models.forEach(m=>{
    const d=m.dailyAvg>0?Math.floor(m.stock/m.dailyAvg):999;
    const t=m.lastUpdate?new Date(m.lastUpdate).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"}):"—";
    if(m.stock<m.minStock||d<=LEAD){text+=\`🔴 *\${m.name}* — \${d} ימים | 🕐\${t}\\n\`;n++;}
    else if(d<=LEAD+30){text+=\`🟡 *\${m.name}* — \${d} ימים\\n\`;n++;}
  });
  bot.sendMessage(msg.chat.id,n?text:"✅ הכל תקין!",{parse_mode:"Markdown"});
});

bot.onText(/\\/report/,msg=>{
  const chatId=msg.chat.id;
  S[chatId]={mode:"report",step:0,date:todayStr(),entries:[]};
  bot.sendMessage(chatId,\`📝 *ספירת סוף יום*\\n\${new Date().toLocaleDateString("he-IL")}\\n\\nנתחיל! כמה יחידות נשלחו?\`,{parse_mode:"Markdown"});
  askReport(chatId);
});

function todayStr(){return new Date().toISOString().split("T")[0];}
function askReport(chatId){
  const s=S[chatId];
  if(!s||s.step>=inv.models.length)return finishReport(chatId);
  const m=inv.models[s.step];
  const t=m.lastUpdate?new Date(m.lastUpdate).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"}):"—";
  bot.sendMessage(chatId,\`[\${s.step+1}/\${inv.models.length}] 📦 *\${m.name}*\\n\${m.category||""} | מלאי: \${m.stock} | 🕐\${t}\\n\\nכמה נשלחו? (0 אם לא)\`,{parse_mode:"Markdown"});
}
function finishReport(chatId){
  const s=S[chatId];if(!s)return;
  inv.history=inv.history||[];
  inv.history.push({date:s.date,time:new Date().toISOString(),entries:s.entries});
  if(inv.history.length>90)inv.history.shift();
  persist(inv);
  let sum=\`✅ *דוח \${s.date} נשמר!*\\n🕐 \${new Date().toLocaleTimeString("he-IL")}\\n\\n\`;
  let alerts="";
  s.entries.filter(e=>e.sent>0).forEach(e=>{sum+=\`• \${e.name}: \${e.sent}\\n\`;});
  inv.models.forEach(m=>{
    const d=m.dailyAvg>0?Math.floor(m.stock/m.dailyAvg):999;
    if(m.stock<m.minStock||d<=LEAD)alerts+=\`🔴 *\${m.name}* — \${d} ימים\\n\`;
    else if(d<=LEAD+30)alerts+=\`🟡 *\${m.name}* — \${d} ימים\\n\`;
  });
  if(alerts)sum+="\\n⚠️ *התראות:*\\n"+alerts;
  bot.sendMessage(chatId,sum,{parse_mode:"Markdown"});
  delete S[chatId];
}

bot.onText(/\\/edit/,msg=>{
  const chatId=msg.chat.id;
  let text="✏️ *חפש דגם לעריכה:*\\nשלח /find שם לחיפוש, אחר כך /set שם כמות לעדכון מהיר\\n\\nאו שלח שם דגם לעריכה מלאה:";
  S[chatId]={mode:"edit_search"};
  bot.sendMessage(chatId,text,{parse_mode:"Markdown"});
});

bot.onText(/\\/add (.+) (\\d+)/,msg=>{
  const [,name,min]=msg.text.match(/\\/add (.+) (\\d+)/);
  inv.models.push({id:Date.now(),name:name.trim(),sku:"",category:"אחר",stock:parseInt(min),minStock:parseInt(min),dailyAvg:2,lastUpdate:new Date().toISOString()});
  persist(inv);
  bot.sendMessage(msg.chat.id,\`✅ *\${name}* נוסף!\`,{parse_mode:"Markdown"});
});

bot.onText(/\\/del (.+)/,msg=>{
  const [,name]=msg.text.match(/\\/del (.+)/);
  const m=inv.models.find(m=>m.name.toLowerCase().includes(name.toLowerCase()));
  if(!m)return bot.sendMessage(msg.chat.id,\`❌ לא נמצא "\${name}"\`);
  S[msg.chat.id]={mode:"confirm_del",modelId:m.id};
  bot.sendMessage(msg.chat.id,\`⚠️ למחוק *\${m.name}*? שלח *כן*:\`,{parse_mode:"Markdown"});
});

bot.onText(/\\/history/,msg=>{
  const h=(inv.history||[]).slice(-7);
  if(!h.length)return bot.sendMessage(msg.chat.id,"אין היסטוריה.");
  let text="📊 *7 ימים אחרונים:*\\n\\n";
  [...h].reverse().forEach(d=>{
    const t=d.time?new Date(d.time).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"}):"";
    const tot=d.entries.reduce((s,e)=>s+e.sent,0);
    text+=\`📅 *\${d.date}* \${t} — \${tot} יח'\\n\`;
  });
  bot.sendMessage(msg.chat.id,text,{parse_mode:"Markdown"});
});

bot.onText(/\\/settime (\\d{1,2}):(\\d{2})/,msg=>{
  const [,h,m]=msg.text.match(/\\/settime (\\d{1,2}):(\\d{2})/);
  inv.schedule={hour:parseInt(h),minute:parseInt(m)};persist(inv);
  bot.sendMessage(msg.chat.id,\`✅ שעת עדכון: \${h.padStart(2,"0")}:\${m}\`);
});

bot.on("message",msg=>{
  const chatId=msg.chat.id;const s=S[chatId];
  if(!s||msg.text?.startsWith("/"))return;
  if(s.mode==="report"){
    const n=parseInt(msg.text);
    if(isNaN(n)||n<0)return bot.sendMessage(chatId,"❌ מספר בלבד");
    const m=inv.models[s.step];
    s.entries.push({modelId:m.id,name:m.name,sent:n});
    m.stock=Math.max(0,m.stock-n);
    m.dailyAvg=Math.max(1,Math.round(((m.dailyAvg||0)*6+n)/7));
    m.lastUpdate=new Date().toISOString();
    s.step++;s.step<inv.models.length?askReport(chatId):finishReport(chatId);
    return;
  }
  if(s.mode==="edit_search"){
    const ms=inv.models.filter(m=>m.name.toLowerCase().includes(msg.text.toLowerCase()));
    if(!ms.length){bot.sendMessage(chatId,"❌ לא נמצא. נסה שוב:");return;}
    if(ms.length>1){
      let text=\`נמצאו \${ms.length}, בחר מספר:\\n\`;
      ms.slice(0,10).forEach((m,i)=>text+=\`\${i+1}. \${m.name}\\n\`);
      S[chatId]={mode:"edit_pick",results:ms.slice(0,10)};
      bot.sendMessage(chatId,text);return;
    }
    showEditMenu(chatId,ms[0]);return;
  }
  if(s.mode==="edit_pick"){
    const i=parseInt(msg.text)-1;
    if(isNaN(i)||i<0||i>=s.results.length)return bot.sendMessage(chatId,"❌ מספר לא תקין");
    showEditMenu(chatId,s.results[i]);return;
  }
  if(s.mode==="edit_field"){
    const f=parseInt(msg.text);
    if(![1,2,3,4].includes(f))return bot.sendMessage(chatId,"❌ שלח 1-4");
    S[chatId]={...s,mode:"edit_value",field:f};
    bot.sendMessage(chatId,"הכנס ערך חדש:");return;
  }
  if(s.mode==="edit_value"){
    const m=inv.models.find(m=>m.id===s.modelId);if(!m){delete S[chatId];return;}
    if(s.field===4){m.name=msg.text.trim();}
    else{const v=parseInt(msg.text);if(isNaN(v)||v<0)return bot.sendMessage(chatId,"❌ מספר לא תקין");
      if(s.field===1){m.stock=v;m.lastUpdate=new Date().toISOString();}
      if(s.field===2)m.minStock=v;
      if(s.field===3)m.dailyAvg=Math.max(1,v);}
    persist(inv);
    bot.sendMessage(chatId,\`✅ *\${m.name}* עודכן!\\n🕐 \${new Date().toLocaleTimeString("he-IL")}\`,{parse_mode:"Markdown"});
    delete S[chatId];return;
  }
  if(s.mode==="confirm_del"){
    if(msg.text?.trim()==="כן"){
      const m=inv.models.find(m=>m.id===s.modelId);const name=m?.name||"";
      inv.models=inv.models.filter(m=>m.id!==s.modelId);persist(inv);
      bot.sendMessage(chatId,\`🗑 *\${name}* נמחק.\`,{parse_mode:"Markdown"});
    }else bot.sendMessage(chatId,"↩️ ביטול.");
    delete S[chatId];
  }
});

function showEditMenu(chatId,m){
  const t=m.lastUpdate?new Date(m.lastUpdate).toLocaleString("he-IL"):"—";
  S[chatId]={mode:"edit_field",modelId:m.id};
  bot.sendMessage(chatId,\`✏️ *\${m.name}*\\nמלאי: \${m.stock} | מינ': \${m.minStock} | יומי: \${m.dailyAvg}\\n🕐 \${t}\\n\\n1. מלאי נוכחי\\n2. כמות מינימום\\n3. ממוצע יומי\\n4. שם\\n\\nשלח מספר:\`,{parse_mode:"Markdown"});
}

setInterval(()=>{
  const sc=inv.schedule||{hour:18,minute:0};const now=new Date();
  if(now.getHours()!==sc.hour||now.getMinutes()!==sc.minute)return;
  bot.sendMessage(ADMIN_CHAT_ID,\`⏰ *שעת עדכון מלאי!*\\nשלח /report לספירת סוף יום\`,{parse_mode:"Markdown"});
  let alerts="";
  inv.models.forEach(m=>{const d=m.dailyAvg>0?Math.floor(m.stock/m.dailyAvg):999;if(m.stock<m.minStock||d<=LEAD)alerts+=\`🔴 \${m.name} — \${d} ימים\\n\`;});
  if(alerts)setTimeout(()=>bot.sendMessage(ADMIN_CHAT_ID,"🚨 *קריטי להזמנה:*\\n"+alerts,{parse_mode:"Markdown"}),2000);
},60000);
console.log("🤖 בוט פעיל! 245 דגמים טעונים.");`;

// ── Standalone components (outside App, no hook violations) ─────────────────

function StockBar({stock,minStock,dailyAvg}){
  const d=daysLeft(stock,dailyAvg);
  const lv=alertLevel(stock,minStock,d);
  const pct=Math.min(100,Math.round((d/(LEAD*2))*100));
  const col=lv==="ok"?C.green:lv==="warning"?C.yellow:C.red;
  const pulse=lv==="critical"||lv==="out";
  return(
    <div style={{marginTop:6}}>
      <div style={{background:C.border,borderRadius:3,height:5,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:3,
          animation:pulse?"pulse 1.5s infinite":""}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginTop:3}}>
        <span>מלאי: {stock}</span><span>~{d===999?"∞":d} יום</span><span>מינ': {minStock}</span>
      </div>
    </div>
  );
}

function ModelCard({model,onEdit,onCount}){
  const [sent,setSent]=useState("");
  const d=daysLeft(model.stock,model.dailyAvg);
  const lv=alertLevel(model.stock,model.minStock,d);
  const {bg,t}=BADGE[lv];
  const go=()=>{const n=parseInt(sent);if(!isNaN(n)&&n>=0){onCount(model.id,n);setSent("");}};
  return(
    <div style={{background:C.mid,border:`1px solid ${lv==="critical"?C.red:lv==="warning"?C.yellow:C.border}`,borderRadius:10,padding:"12px 14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{model.name}</div>
          {model.sku&&<div style={{fontSize:11,color:C.amber,marginTop:1}}>#{model.sku} · {model.category}</div>}
          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{background:bg,color:"#fff",borderRadius:5,padding:"1px 8px",fontSize:11,fontWeight:700}}>{t}</span>
            {model.lastUpdate&&<span style={{fontSize:10,color:C.muted}}>🕐{fmtTime(model.lastUpdate)}</span>}
          </div>
        </div>
        <button onClick={()=>onEdit(model)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"3px 7px",cursor:"pointer",fontSize:11,flexShrink:0}}>✏️</button>
      </div>
      <StockBar stock={model.stock} minStock={model.minStock} dailyAvg={model.dailyAvg}/>
      <div style={{display:"flex",gap:5,marginTop:8}}>
        <input type="number" min="0" placeholder="נשלחו היום" value={sent}
          onChange={e=>setSent(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&go()}
          style={{flex:1,background:C.light,border:`1px solid ${C.border}`,borderRadius:6,
            padding:"5px 8px",color:C.text,fontSize:12,outline:"none",textAlign:"center"}}/>
        <button onClick={go} style={{background:C.amber,color:C.navy,border:"none",
          borderRadius:6,padding:"5px 12px",cursor:"pointer",fontWeight:700,fontSize:13}}>✓</button>
      </div>
    </div>
  );
}

function ScheduleModal({schedule,onSave,onClose}){
  const [h,setH]=useState(schedule.hour);
  const [min,setMin]=useState(schedule.minute);
  const [days,setDays]=useState(schedule.days||[0,1,2,3,4,5,6]);
  const NAMES=["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"];
  const tog=d=>setDays(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d].sort());
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:14,padding:24,width:"100%",maxWidth:360}}>
        <div style={{fontWeight:800,fontSize:17,color:C.amber,marginBottom:18}}>🕐 שעת עדכון יומית</div>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[["שעה",h,0,23,setH],["דקות",min,0,59,setMin]].map(([l,v,mn,mx,fn])=>(
            <div key={l} style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{l}</div>
              <input type="number" min={mn} max={mx} value={v}
                onChange={e=>fn(Math.max(mn,Math.min(mx,+e.target.value)))}
                style={{width:"100%",background:C.light,border:`1px solid ${C.border}`,
                  borderRadius:8,padding:10,color:C.text,fontSize:22,fontWeight:700,
                  textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:5,marginBottom:16,flexWrap:"wrap"}}>
          {NAMES.map((n,i)=>(
            <button key={i} onClick={()=>tog(i)}
              style={{background:days.includes(i)?C.amber:C.light,
                color:days.includes(i)?C.navy:C.muted,
                border:`1px solid ${days.includes(i)?C.amber:C.border}`,
                borderRadius:7,padding:"7px 10px",cursor:"pointer",fontWeight:700}}>{n}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,background:C.border,color:C.text,border:"none",borderRadius:8,padding:11,cursor:"pointer"}}>ביטול</button>
          <button onClick={()=>onSave({hour:h,minute:min,days})}
            style={{flex:2,background:C.amber,color:C.navy,border:"none",borderRadius:8,padding:11,cursor:"pointer",fontWeight:700}}>שמור</button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({history,models}){
  const [period,setPeriod]=useState(30);
  const [view,setView]=useState("top");

  const stats=useMemo(()=>{
    const cutoff=new Date(Date.now()-period*864e5);
    const filtered=history.filter(d=>new Date(d.time||d.date)>=cutoff);
    const totals={};
    filtered.forEach(day=>day.entries.forEach(e=>{if(e.sent>0)totals[e.name]=(totals[e.name]||0)+e.sent;}));
    const sorted=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
    return{sorted,totalSent:sorted.reduce((s,[,v])=>s+v,0),totalDays:filtered.length};
  },[history,period]);

  const weeklyData=useMemo(()=>{
    const now=Date.now();
    return Array.from({length:8},(_,w)=>{
      const from=new Date(now-(w+1)*7*864e5);
      const to=new Date(now-w*7*864e5);
      const days=history.filter(d=>{const dt=new Date(d.time||d.date);return dt>=from&&dt<to;});
      const total=days.reduce((s,d)=>s+d.entries.reduce((ss,e)=>ss+e.sent,0),0);
      return{label:from.toLocaleDateString("he-IL",{day:"numeric",month:"numeric"}),total,days:days.length};
    }).reverse();
  },[history]);

  const monthlyData=useMemo(()=>{
    const now=new Date();
    return Array.from({length:6},(_,mo)=>{
      const d=new Date(now.getFullYear(),now.getMonth()-mo,1);
      const label=d.toLocaleDateString("he-IL",{month:"short",year:"2-digit"});
      const days=history.filter(day=>{const dt=new Date(day.time||day.date);return dt.getMonth()===d.getMonth()&&dt.getFullYear()===d.getFullYear();});
      const total=days.reduce((s,dd)=>s+dd.entries.reduce((ss,e)=>ss+e.sent,0),0);
      const top={};
      days.forEach(dd=>dd.entries.forEach(e=>{if(e.sent>0)top[e.name]=(top[e.name]||0)+e.sent;}));
      const top3=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n,q])=>({n,q}));
      return{label,total,days:days.length,top3};
    }).reverse();
  },[history]);

  const insights=useMemo(()=>{
    const ms={};
    history.forEach(day=>day.entries.forEach(e=>{
      if(!ms[e.name])ms[e.name]={total:0,days:0};
      ms[e.name].total+=e.sent;
      if(e.sent>0)ms[e.name].days++;
    }));
    const sorted=Object.entries(ms).filter(([,s])=>s.total>0).sort((a,b)=>b[1].total-a[1].total);
    const totalSent=sorted.reduce((s,[,v])=>s+v.total,0);
    const top20=sorted.slice(0,Math.max(1,Math.ceil(sorted.length*0.2)));
    const top20total=top20.reduce((s,[,v])=>s+v.total,0);
    const neverSold=models.filter(m=>!ms[m.name]||ms[m.name].total===0);
    return{sorted,totalSent,top20,top20pct:totalSent?Math.round(top20total/totalSent*100):0,neverSold,stars:sorted.slice(0,5),slow:sorted.slice(-5).reverse()};
  },[history,models]);

  const maxW=Math.max(...weeklyData.map(w=>w.total),1);
  const maxM=Math.max(...monthlyData.map(m=>m.total),1);

  const Btn=({v,l})=>(
    <button onClick={()=>setView(v)} style={{background:view===v?C.amber:C.mid,color:view===v?C.navy:C.muted,
      border:`1px solid ${view===v?C.amber:C.border}`,borderRadius:7,padding:"7px 14px",
      cursor:"pointer",fontSize:13,fontWeight:view===v?700:400}}>{l}</button>
  );
  const PBtn=({d,l})=>(
    <button onClick={()=>setPeriod(d)} style={{background:period===d?C.amber:C.mid,color:period===d?C.navy:C.muted,
      border:`1px solid ${period===d?C.amber:C.border}`,borderRadius:7,padding:"6px 11px",
      cursor:"pointer",fontSize:12,fontWeight:600}}>{l}</button>
  );

  const noData=<div style={{textAlign:"center",color:C.muted,padding:60,fontSize:14}}>אין נתוני שילוח עדיין.<br/>עדכן שילוחים בטאב 📦 המלאי.</div>;

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <Btn v="top" l="🏆 Top מכירות"/>
        <Btn v="weekly" l="📅 שבועי"/>
        <Btn v="monthly" l="📆 חודשי"/>
        <Btn v="insight" l="💡 תובנות"/>
      </div>

      {view==="top"&&<>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          <PBtn d={7} l="7 ימים"/><PBtn d={30} l="30 יום"/><PBtn d={90} l="רבעון"/><PBtn d={365} l="שנה"/>
        </div>
        {stats.totalSent===0?noData:<>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {[["סה"כ",`${stats.totalSent} יח'`,C.amber],["ימים",stats.totalDays,C.green],
              ["ממוצע/יום",stats.totalDays>0?(stats.totalSent/stats.totalDays).toFixed(1):0,C.text],
              ["דגמים",stats.sorted.length,C.text]
            ].map(([l,v,col])=>(
              <div key={l} style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:10,
                padding:"10px 14px",flex:1,minWidth:80,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:3}}>{l}</div>
                <div style={{fontSize:18,fontWeight:800,color:col}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {stats.sorted.slice(0,25).map(([name,qty],i)=>{
              const pct=Math.round(qty/stats.totalSent*100);
              const mo=models.find(m=>m.name===name);
              const lv=mo?alertLevel(mo.stock,mo.minStock,daysLeft(mo.stock,mo.dailyAvg)):"ok";
              return(
                <div key={name} style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:15}}>{"🥇🥈🥉"[i]||`${i+1}.`}</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{name}</div>
                        {mo?.sku&&<div style={{fontSize:10,color:C.amber}}>#{mo.sku}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {lv==="critical"&&<span style={{background:C.red,color:"#fff",fontSize:10,borderRadius:4,padding:"1px 6px"}}>⚠️ הזמן!</span>}
                      <div style={{textAlign:"center"}}>
                        <div style={{fontWeight:800,fontSize:16,color:C.amber}}>{qty}</div>
                        <div style={{fontSize:10,color:C.muted}}>{pct}%</div>
                      </div>
                    </div>
                  </div>
                  <div style={{background:C.border,borderRadius:3,height:5,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:i<3?C.amber:C.green,borderRadius:3}}/>
                  </div>
                </div>
              );
            })}
            {stats.sorted.length>25&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:8}}>...ועוד {stats.sorted.length-25} דגמים</div>}
          </div>
        </>}
      </>}

      {view==="weekly"&&<>
        <div style={{fontWeight:700,color:C.amber,marginBottom:14}}>📅 שילוחים שבועיים — 8 שבועות</div>
        {weeklyData.every(w=>w.total===0)?noData:
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...weeklyData].reverse().map((w,i)=>(
              <div key={i} style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:9,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:i===7?C.amber:C.text}}>
                      {i===7?"השבוע":i===6?"שבוע שעבר":`${8-i} שבועות לפני`}
                    </div>
                    <div style={{fontSize:11,color:C.muted}}>{w.label} · {w.days} ימים</div>
                  </div>
                  <div style={{fontWeight:800,fontSize:18,color:C.amber}}>{w.total} <span style={{fontSize:11,color:C.muted,fontWeight:400}}>יח'</span></div>
                </div>
                <div style={{background:C.border,borderRadius:3,height:7,overflow:"hidden"}}>
                  <div style={{width:`${Math.round(w.total/maxW*100)}%`,height:"100%",background:i===7?C.amber:C.green,borderRadius:3}}/>
                </div>
              </div>
            ))}
          </div>
        }
      </>}

      {view==="monthly"&&<>
        <div style={{fontWeight:700,color:C.amber,marginBottom:14}}>📆 סיכום חודשי — 6 חודשים</div>
        {monthlyData.every(m=>m.total===0)?noData:
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[...monthlyData].reverse().map((m,i)=>(
              <div key={i} style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:i===0?C.amber:C.text}}>{m.label}</div>
                    <div style={{fontSize:11,color:C.muted}}>{m.days} ימים {m.days>0?`· ${(m.total/m.days).toFixed(1)}/יום`:""}</div>
                  </div>
                  <div style={{fontWeight:800,fontSize:20,color:C.amber}}>{m.total} <span style={{fontSize:11,color:C.muted,fontWeight:400}}>יח'</span></div>
                </div>
                <div style={{background:C.border,borderRadius:3,height:7,overflow:"hidden",marginBottom:8}}>
                  <div style={{width:`${Math.round(m.total/maxM*100)}%`,height:"100%",background:i===0?C.amber:C.green,borderRadius:3}}/>
                </div>
                {m.top3.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {m.top3.map(({n,q})=>(
                    <span key={n} style={{background:C.light,border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 8px",fontSize:11}}>🏆 {n}: {q}</span>
                  ))}
                </div>}
              </div>
            ))}
          </div>
        }
      </>}

      {view==="insight"&&<>
        <div style={{fontWeight:700,color:C.amber,marginBottom:14}}>💡 תובנות עסקיות</div>
        {insights.totalSent===0?noData:<>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {[["סה"כ נשלח",`${insights.totalSent} יח'`,C.amber],
              ["פעילים",insights.sorted.length,C.green],
              ["לא נמכרו",insights.neverSold.length,C.red],
              [`Top ${insights.top20.length}`,`${insights.top20pct}%`,C.amber]
            ].map(([l,v,col])=>(
              <div key={l} style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",flex:1,minWidth:80,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:3}}>{l}</div>
                <div style={{fontSize:16,fontWeight:800,color:col}}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{background:C.mid,border:`1px solid ${C.green}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontWeight:700,color:C.green,marginBottom:10}}>⭐ כוכבים — שווה להחזיק מלאי גבוה</div>
            {insights.stars.map(([name,s],i)=>{
              const mo=models.find(m=>m.name===name);
              const lv=mo?alertLevel(mo.stock,mo.minStock,daysLeft(mo.stock,mo.dailyAvg)):"ok";
              return(
                <div key={name} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                  <span style={{fontSize:13}}>{"🥇🥈🥉🏅🏅"[i]} {name}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {lv==="critical"&&<span style={{background:C.red,color:"#fff",fontSize:10,borderRadius:4,padding:"1px 5px"}}>⚠️ הזמן!</span>}
                    <span style={{fontWeight:700,color:C.amber}}>{s.total} יח'</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{background:C.mid,border:`1px solid ${C.yellow}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontWeight:700,color:C.yellow,marginBottom:10}}>🐢 איטיים — שקול להקטין הזמנה</div>
            {insights.slow.map(([name,s])=>(
              <div key={name} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13,color:C.muted}}>{name}</span>
                <span style={{fontWeight:700,color:C.yellow}}>{s.total} יח'</span>
              </div>
            ))}
          </div>

          {insights.neverSold.length>0&&(
            <div style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontWeight:700,color:C.muted,marginBottom:10}}>⬛ לא נמכרו כלל ({insights.neverSold.length})</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {insights.neverSold.slice(0,20).map(m=>(
                  <span key={m.id} style={{background:C.light,border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 7px",fontSize:11,color:C.muted}}>{m.name}</span>
                ))}
                {insights.neverSold.length>20&&<span style={{color:C.muted,fontSize:11}}>...ועוד {insights.neverSold.length-20}</span>}
              </div>
            </div>
          )}
        </>}
      </>}
    </div>
  );
}

// ── Add/Edit Modal ─────────────────────────────────────────────────────────────
function ModelModal({editModel,onSave,onDelete,onClose}){
  const [form,setForm]=useState({
    name:editModel?.name||"",sku:editModel?.sku||"",
    category:editModel?.category||"",minStock:editModel?.minStock||"",
    stock:editModel?.stock||"",dailyAvg:editModel?.dailyAvg||""
  });
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const ok=()=>{if(!form.name.trim()||!form.minStock||!form.stock)return;onSave(form);};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:100,padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:14,padding:22,
        width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontWeight:800,fontSize:17,color:C.amber,marginBottom:18}}>
          {editModel?"✏️ עריכת דגם":"➕ דגם חדש"}
        </div>
        {editModel?.lastUpdate&&(
          <div style={{background:C.light,borderRadius:7,padding:"7px 12px",marginBottom:14,fontSize:11,color:C.muted}}>
            🕐 עדכון אחרון: {fmtTime(editModel.lastUpdate)}
          </div>
        )}
        {[{k:"name",l:"שם הדגם",p:"לדוג': 8121 שחור",t:"text"},
          {k:"sku",l:"מספר דגם (SKU)",p:"לדוג': 8121",t:"text"},
          {k:"category",l:"קטגוריה",p:"לדוג': קופסאות מתכת",t:"text"},
          {k:"stock",l:"מלאי נוכחי",p:"כמות",t:"number"},
          {k:"minStock",l:"מינימום להזמנה",p:"500",t:"number"},
          {k:"dailyAvg",l:"ממוצע שילוח יומי",p:"2",t:"number"},
        ].map(({k,l,p,t})=>(
          <div key={k} style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:12,color:C.muted,marginBottom:4}}>{l}</label>
            <input type={t} placeholder={p} value={form[k]} onChange={set(k)}
              style={{width:"100%",background:C.light,border:`1px solid ${C.border}`,
                borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,
                outline:"none",boxSizing:"border-box"}}/>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:4}}>
          {editModel&&<button onClick={()=>onDelete(editModel.id)} style={{flex:1,background:C.redDim,color:"#fff",border:"none",borderRadius:8,padding:11,cursor:"pointer",fontWeight:700}}>🗑</button>}
          <button onClick={onClose} style={{flex:1,background:C.border,color:C.text,border:"none",borderRadius:8,padding:11,cursor:"pointer"}}>ביטול</button>
          <button onClick={ok} style={{flex:2,background:C.amber,color:C.navy,border:"none",borderRadius:8,padding:11,cursor:"pointer",fontWeight:700,fontSize:14}}>שמור</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App(){
  const [models,setModels]=useState([]);
  const [history,setHistory]=useState([]);
  const [schedule,setSchedule]=useState({hour:18,minute:0,days:[0,1,2,3,4,5,6]});
  const [tab,setTab]=useState("inventory");
  const [editModel,setEditModel]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [showSched,setShowSched]=useState(false);
  const [search,setSearch]=useState("");
  const [catFilter,setCatFilter]=useState("all");
  const [levelFilter,setLevelFilter]=useState("all");
  const [copied,setCopied]=useState(false);

  useEffect(()=>{(async()=>{
    const m=await load("models_v5");
    const h=await load("history");
    const s=await load("schedule");
    setModels(m||BASE_MODELS);
    setHistory(h||[]);
    setSchedule(s||{hour:18,minute:0,days:[0,1,2,3,4,5,6]});
  })();},[]);

  const persist=useCallback(async(m,h,s)=>{
    if(m!==undefined)await save("models_v5",m);
    if(h!==undefined)await save("history",h);
    if(s!==undefined)await save("schedule",s);
  },[]);

  const handleCount=useCallback((id,sent)=>{
    const now=new Date().toISOString();
    setModels(prev=>{
      const next=prev.map(m=>m.id!==id?m:{
        ...m,
        stock:Math.max(0,m.stock-sent),
        dailyAvg:Math.max(1,Math.round(((m.dailyAvg||0)*6+sent)/7)),
        lastUpdate:now
      });
      persist(next);
      return next;
    });
    setHistory(prev=>{
      const today=todayStr();
      const modelName=models.find(m=>m.id===id)?.name||"";
      const ex=prev.find(d=>d.date===today);
      let next;
      if(ex){
        next=prev.map(d=>{
          if(d.date!==today)return d;
          const e=d.entries.find(e=>e.modelId===id);
          return{...d,time:now,entries:e
            ?d.entries.map(en=>en.modelId===id?{...en,sent:en.sent+sent}:en)
            :[...d.entries,{modelId:id,name:modelName,sent}]};
        });
      } else {
        next=[...prev,{date:today,time:now,entries:[{modelId:id,name:modelName,sent}]}];
      }
      if(next.length>365)next=next.slice(-365);
      persist(undefined,next);
      return next;
    });
  },[models,persist]);

  const handleSaveModel=useCallback((form)=>{
    const now=new Date().toISOString();
    setModels(prev=>{
      let next;
      if(editModel){
        next=prev.map(m=>m.id===editModel.id
          ?{...m,...form,minStock:+form.minStock,stock:+form.stock,dailyAvg:+form.dailyAvg||2,lastUpdate:now}
          :m);
      } else {
        next=[...prev,{id:Date.now(),...form,minStock:+form.minStock,stock:+form.stock,dailyAvg:+form.dailyAvg||2,lastUpdate:now}];
      }
      persist(next);
      return next;
    });
    setEditModel(null);setShowAdd(false);
  },[editModel,persist]);

  const handleDelete=useCallback(id=>{
    setModels(prev=>{const n=prev.filter(m=>m.id!==id);persist(n);return n;});
    setEditModel(null);setShowAdd(false);
  },[persist]);

  const cats=useMemo(()=>["all",...Array.from(new Set(models.map(m=>m.category).filter(Boolean)))]  ,[models]);

  const filtered=useMemo(()=>models.filter(m=>{
    const q=search.toLowerCase();
    if(!(m.name.toLowerCase().includes(q)||(m.sku&&m.sku.toLowerCase().includes(q))||(m.category&&m.category.toLowerCase().includes(q))))return false;
    if(catFilter!=="all"&&m.category!==catFilter)return false;
    if(levelFilter==="all")return true;
    return alertLevel(m.stock,m.minStock,daysLeft(m.stock,m.dailyAvg))===levelFilter;
  }),[models,search,catFilter,levelFilter]);

  const critical=useMemo(()=>models.filter(m=>alertLevel(m.stock,m.minStock,daysLeft(m.stock,m.dailyAvg))==="critical").length,[models]);
  const outCount=useMemo(()=>models.filter(m=>m.stock<=0).length,[models]);
  const todaySent=useMemo(()=>history.find(d=>d.date===todayStr())?.entries.reduce((s,e)=>s+e.sent,0)||0,[history]);
  const sl=`${String(schedule.hour).padStart(2,"0")}:${String(schedule.minute).padStart(2,"0")}`;

  const NAV=[
    ["inventory","📦 מלאי"],
    ["alerts",`⚠️${critical?` (${critical})`:""}` ],
    ["history","📊 היסטוריה"],
    ["analytics","📈 אנליטיקה"],
    ["bot","🤖 בוט"],
  ];

  return(
    <div style={{minHeight:"100vh",background:C.navy,color:C.text,fontFamily:"'Segoe UI',Arial,sans-serif",direction:"rtl"}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}input:focus{border-color:${C.amber}!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.mid}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}`}</style>

      {/* Header */}
      <div style={{background:C.mid,borderBottom:`1px solid ${C.border}`,padding:"12px 16px"}}>
        <div style={{maxWidth:980,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:C.amber}}>🕶️ מלאי חביב שיווק</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2,display:"flex",gap:8,flexWrap:"wrap"}}>
              <span>{models.length} דגמים</span><span>·</span>
              <span>היום: {todaySent} יח'</span>
              {outCount>0&&<><span>·</span><span style={{color:C.red}}>⬛{outCount} אזלו</span></>}
              <span>·</span>
              <span onClick={()=>setShowSched(true)} style={{color:C.amber,cursor:"pointer"}}>🕐{sl}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {critical>0&&<div style={{background:C.red,color:"#fff",padding:"5px 10px",borderRadius:7,fontSize:12,fontWeight:700}}>🔴{critical} דחופים</div>}
            <button onClick={()=>setShowSched(true)} style={{background:C.light,color:C.amber,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:12}}>🕐</button>
            <button onClick={()=>{setEditModel(null);setShowAdd(true);}}
              style={{background:C.amber,color:C.navy,border:"none",borderRadius:7,padding:"6px 14px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ דגם</button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{background:C.light,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:980,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {NAV.map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{background:tab===k?C.amber:"transparent",color:tab===k?C.navy:C.muted,
                border:"none",padding:"11px 14px",cursor:"pointer",fontWeight:tab===k?700:400,
                fontSize:13,whiteSpace:"nowrap",transition:"all .2s"}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"16px"}}>

        {/* INVENTORY */}
        {tab==="inventory"&&<>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            <input placeholder="🔍 שם / SKU / צבע / קטגוריה..." value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{flex:1,minWidth:160,background:C.mid,border:`1px solid ${C.border}`,
                borderRadius:8,padding:"8px 12px",color:C.text,fontSize:13,outline:"none"}}/>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
              style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:8,
                padding:"8px 10px",color:C.text,fontSize:12,outline:"none",cursor:"pointer",maxWidth:170}}>
              <option value="all">כל הקטגוריות</option>
              {cats.filter(c=>c!=="all").map(c=><option key={c} value={c}>{CAT_ICON[c]||"•"} {c}</option>)}
            </select>
            {["all","ok","warning","critical","out"].map(lv=>(
              <button key={lv} onClick={()=>setLevelFilter(lv)}
                style={{background:levelFilter===lv?C.amber:C.mid,color:levelFilter===lv?C.navy:C.muted,
                  border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12,fontWeight:600}}>
                {{all:"הכל",ok:"✅",warning:"🟡",critical:"🔴",out:"⬛"}[lv]}
              </button>
            ))}
          </div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10}}>מציג {filtered.length} / {models.length}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:10}}>
            {filtered.map(m=><ModelCard key={m.id} model={m} onEdit={m=>{setEditModel(m);setShowAdd(true);}} onCount={handleCount}/>)}
            {!filtered.length&&<div style={{gridColumn:"1/-1",textAlign:"center",color:C.muted,padding:40}}>אין תוצאות</div>}
          </div>
        </>}

        {/* ALERTS */}
        {tab==="alerts"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:12,color:C.muted,marginBottom:4}}>זמן הגעה מסין: {LEAD} יום · מינ' הזמנה: 500 יח'</div>
          {models.map(m=>({...m,d:daysLeft(m.stock,m.dailyAvg),lv:alertLevel(m.stock,m.minStock,daysLeft(m.stock,m.dailyAvg))}))
            .filter(m=>m.lv!=="ok").sort((a,b)=>a.d-b.d)
            .map(m=>(
              <div key={m.id} style={{background:C.mid,border:`1px solid ${m.lv==="critical"?C.red:C.yellow}`,
                borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",
                alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontWeight:700}}>{m.name} {m.sku&&<span style={{color:C.amber,fontSize:12}}>#{m.sku}</span>}</div>
                  <div style={{color:C.muted,fontSize:12,marginTop:3}}>מלאי: {m.stock} · יומי: {m.dailyAvg} · ~{m.d} יום</div>
                  {m.lastUpdate&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>🕐 {fmtTime(m.lastUpdate)}</div>}
                  {m.d<=LEAD&&<div style={{color:C.red,fontSize:11,marginTop:3,fontWeight:600}}>⏰ הזמן מיידית!</div>}
                </div>
                <span style={{background:BADGE[m.lv].bg,color:"#fff",borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700}}>{BADGE[m.lv].t}</span>
              </div>
            ))}
          {!models.some(m=>alertLevel(m.stock,m.minStock,daysLeft(m.stock,m.dailyAvg))!=="ok")&&
            <div style={{textAlign:"center",color:C.green,padding:60,fontSize:18}}>✅ הכל תקין!</div>}
        </div>}

        {/* HISTORY */}
        {tab==="history"&&<div>
          {!history.length&&<div style={{textAlign:"center",color:C.muted,padding:60}}>אין היסטוריה.</div>}
          {[...history].reverse().slice(0,30).map((day,i)=>(
            <div key={i} style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontWeight:700,color:C.amber}}>📅 {day.date}</div>
                <div style={{fontSize:11,color:C.muted,display:"flex",gap:8}}>
                  {day.time&&<span>🕐{new Date(day.time).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"})}</span>}
                  <span>סה"כ {day.entries.reduce((s,e)=>s+e.sent,0)} יח'</span>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {day.entries.filter(e=>e.sent>0).map(e=>(
                  <span key={e.modelId} style={{background:C.light,border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 7px",fontSize:11}}>{e.name}: {e.sent}</span>
                ))}
              </div>
            </div>
          ))}
        </div>}

        {/* ANALYTICS */}
        {tab==="analytics"&&<AnalyticsTab history={history} models={models}/>}

        {/* BOT */}
        {tab==="bot"&&<div>
          <div style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:15,color:C.amber,marginBottom:12}}>🤖 הגדרת בוט טלגרם HavivNartikimBot</div>
            <div style={{fontSize:13,lineHeight:2.2}}>
              {[["1",<>ב-BotFather — העתק את ה-<strong style={{color:C.amber}}>TOKEN</strong> שקיבלת</>],
                ["2",<>פתח <a href="https://github.com" target="_blank" style={{color:C.amber}}>github.com</a> → New Repository → שם: <code style={{background:C.light,padding:"1px 6px",borderRadius:4}}>haviv-bot</code></>],
                ["3","צור קובץ bot.js → העתק את הקוד למטה → שנה YOUR_BOT_TOKEN ו-YOUR_CHAT_ID"],
                ["4",<>צור קובץ <code style={{background:C.light,padding:"1px 6px",borderRadius:4}}>package.json</code> עם: <code style={{background:C.light,padding:"2px 8px",borderRadius:4,direction:"ltr",display:"inline-block"}}>{'{"name":"haviv-bot","scripts":{"start":"node bot.js"},"dependencies":{"node-telegram-bot-api":"^0.64.0"}}'}</code></>],
                ["5",<>פתח <a href="https://render.com" target="_blank" style={{color:C.amber}}>render.com</a> → Sign up with GitHub → New Web Service → בחר <code style={{background:C.light,padding:"1px 6px",borderRadius:4}}>haviv-bot</code></>],
                ["6","Build Command: npm install | Start Command: node bot.js → Deploy ✅"],
                ["7",<>לקבלת Chat ID: שלח הודעה ל-<strong style={{color:C.amber}}>@userinfobot</strong> בטלגרם</>],
              ].map(([n,c])=><div key={n}><span style={{color:C.amber,fontWeight:700}}>{n}.</span> {c}</div>)}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{color:C.muted,fontSize:13,fontWeight:600}}>📄 bot.js</div>
            <button onClick={()=>{navigator.clipboard.writeText(TELEGRAM_CODE);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
              style={{background:copied?C.green:C.amber,color:C.navy,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:700}}>
              {copied?"✓ הועתק!":"📋 העתק"}
            </button>
          </div>
          <textarea readOnly value={TELEGRAM_CODE}
            style={{width:"100%",height:320,background:C.mid,border:`1px solid ${C.border}`,
              borderRadius:10,padding:14,color:"#98c379",fontSize:11,lineHeight:1.6,
              resize:"vertical",outline:"none",boxSizing:"border-box",direction:"ltr"}}/>
          <div style={{background:C.mid,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginTop:14}}>
            <div style={{fontWeight:700,color:C.amber,marginBottom:8}}>📱 כל הפקודות</div>
            {[["/stock","מלאי + שעות עדכון"],["/cat","לפי קטגוריה"],["/find שם","חיפוש דגם"],
              ["/report","ספירת סוף יום"],["/edit","עריכה אינטראקטיבית"],["/set שם כמות","עדכון מהיר"],
              ["/add שם מינ","הוסף דגם"],["/del שם","מחק דגם"],["/alert","התראות"],
              ["/top7 /top30 /top90","Top מכירות לפי תקופה"],["/weekly","סיכום 4 שבועות"],
              ["/monthly","סיכום 3 חודשים"],["/insight","תובנות עסקיות 💡"],
              ["/history","7 ימים"],["/settime HH:MM","שנה שעת תזכורת"]
            ].map(([cmd,desc])=>(
              <div key={cmd} style={{display:"flex",gap:10,padding:"5px 0",borderBottom:`1px solid ${C.border}`,fontSize:12,flexWrap:"wrap"}}>
                <code style={{color:C.amber,minWidth:180,direction:"ltr",textAlign:"left",flexShrink:0}}>{cmd}</code>
                <span style={{color:C.muted}}>{desc}</span>
              </div>
            ))}
          </div>
        </div>}
      </div>

      {showAdd&&<ModelModal editModel={editModel} onSave={handleSaveModel} onDelete={handleDelete} onClose={()=>{setShowAdd(false);setEditModel(null);}}/>}
      {showSched&&<ScheduleModal schedule={schedule} onSave={s=>{setSchedule(s);persist(undefined,undefined,s);setShowSched(false);}} onClose={()=>setShowSched(false)}/>}
    </div>
  );
}
