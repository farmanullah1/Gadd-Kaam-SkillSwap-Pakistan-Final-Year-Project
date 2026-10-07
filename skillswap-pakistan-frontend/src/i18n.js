import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // General Utility
      "dark_mode_toggle": "Toggle dark mode",
      "change_language": "Change language",
      "call_helpline": "Call helpline",

      // Navbar
      "navbar_marketplace": "Marketplace",
      "navbar_about_us": "About Us",
      "navbar_women_zone": "Women-Only Zone",
      "navbar_contact": "Contact",
      "navbar_login_btn": "Log In",
      "navbar_signup_btn": "Sign Up",

      // Hero Section
      "hero_headline": "Trade Skills, Build Futures.",
      "hero_subtext": "Gadd Kaam – SkillSwap Pakistan is a community where you can exchange your talents for the help you need, all without money.",
      "hero_offer_skill_btn": "Offer a Skill",
      "hero_find_skill_btn": "Find a Skill",

      // How It Works Section
      "how_it_works_title": "How It Works",
      "how_it_works_subtitle": "Joining our community is easy. Follow these simple steps to start swapping skills.",
      "step1_title": "1. Create Profile",
      "step1_description": "Sign up and list the skills you can offer. Get verified to build trust.",
      "step2_title": "2. Find & Swap",
      "step2_description": "Browse skills you need, or post a request. Connect with others to arrange a swap.",
      "step3_title": "3. Rate & Earn",
      "step3_description": "Complete the swap, leave feedback, and earn Skill Points for your contributions.",

      // Featured Skills Section
      "featured_skills_title": "Featured Skills",
      "view_all_link": "View All →",
      "view_details_link": "View Details →",

      // Testimonials Section
      "testimonials_title": "What Our Community Says",
      "testimonial1_quote": "I fixed my neighbor's water pump, and in return, his wife taught my daughter how to embroider. Gadd Kaam – SkillSwap made it possible. This is a blessing for our village.",
      "testimonial1_author_name": "Iqbal Hussain",
      "testimonial1_author_details": "Mechanic, Punjab",
      "testimonial2_quote": "As a woman, it's not always easy to find work. Through the women-only zone, I found a safe space to offer my sewing skills and learn accounting from another woman.",
      "testimonial2_author_name": "Samina Akhtar",
      "testimonial2_author_details": "Home Chef, Sindh",

      // Women's Zone Section
      "women_zone_title": "A Safe Space for Women",
      "women_zone_description": "Our Women-Only Skill Zone provides a secure and supportive environment for women to connect, learn, and trade skills with confidence.",
      "women_zone_button": "Explore the Women's Zone",

      // Footer
      "footer_tagline": "Empowering communities by connecting skills, cash-free.",
      "footer_quick_links": "Quick Links",
      "footer_support": "Support",
      "footer_follow_us": "Follow Us",
      "footer_copyright": "Gadd Kaam – SkillSwap Pakistan. All rights reserved.",
      "footer_privacy_policy": "Privacy Policy",
      "footer_terms_of_service": "Terms of Service",

      // Language names for display
      "lang_en": "English",
      "lang_ur": "Urdu",
      "lang_sd": "Sindhi",

      // --- New Signup Page Translations ---
      "signup_join_gadd_kaam": "Join Gadd Kaam",
      "signup_start_offering_finding": "Create an account to start offering and finding skills in your community.",
      "signup_firstName_label": "First Name",
      "signup_firstName_placeholder": "Your first name",
      "signup_lastName_label": "Last Name",
      "signup_lastName_placeholder": "Your last name",
      "signup_profilePicture_label": "Profile Picture",
      "signup_no_file_chosen": "No file selected.",
      "signup_username_label": "Username",
      "signup_username_placeholder": "Choose a username",
      "signup_phoneNumber_label": "Phone Number",
      "signup_email_label": "Email",
      "signup_dateOfBirth_label": "Date of Birth",
      "signup_cnicNumber_label": "CNIC Number",
      "signup_cnicFrontPic_label": "CNIC Front Picture",
      "signup_cnicBackPic_label": "CNIC Back Picture",
      "signup_password_label": "Password",
      "signup_confirmPassword_label": "Confirm Password",
      "signup_create_account_btn": "Create Account",
      "signup_already_have_account": "Already have an account?",
      "signup_login_link": "Log in",

      // Signup Form Errors
      "signup_error_firstName_required": "First Name is required.",
      "signup_error_lastName_required": "Last Name is required.",
      "signup_error_profilePic_required": "Profile Picture is required.",
      "signup_error_username_required": "Username is required.",
      "signup_error_phoneNumber_required": "Phone Number is required.",
      "signup_error_email_required": "Email is required.",
      "signup_error_dob_required": "Date of Birth is required.",
      "signup_error_cnic_invalid": "CNIC Number must be 13 digits.",
      "signup_error_cnicFrontPic_required": "CNIC Front Picture is required.",
      "signup_error_cnicBackPic_required": "CNIC Back Picture is required.",
      "signup_error_password_required": "Password is required.",
      "signup_error_confirmPassword_required": "Confirm Password is required.",
      "signup_error_passwords_mismatch": "Passwords do not match.",
      "signup_success_message": "Account created successfully!"
    }
  },
  ur: { // Urdu translations - Placeholder. You will fill these later.
    translation: {
      "dark_mode_toggle": "ڈارک موڈ ٹوگل کریں",
      "change_language": "زبان تبدیل کریں",
      "call_helpline": "ہیلپ لائن پر کال کریں",

      "navbar_marketplace": "مارکیٹ پلیس",
      "navbar_about_us": "ہمارے بارے میں",
      "navbar_women_zone": "خواتین کے لیے مخصوص",
      "navbar_contact": "رابطہ",
      "navbar_login_btn": "لاگ ان",
      "navbar_signup_btn": "سائن اپ",

      "hero_headline": "مہارتوں کا تبادلہ، مستقبل کی تعمیر۔",
      "hero_subtext": "گڈ کام – اسکل سویپ پاکستان ایک ایسی کمیونٹی ہے جہاں آپ اپنی صلاحیتوں کا تبادلہ اپنی ضرورت کی مدد کے لیے کر سکتے ہیں، بغیر پیسوں کے۔",
      "hero_offer_skill_btn": "مہارت پیش کریں",
      "hero_find_skill_btn": "مہارت تلاش کریں",

      "how_it_works_title": "یہ کیسے کام کرتا ہے",
      "how_it_works_subtitle": "ہماری کمیونٹی میں شامل ہونا آسان ہے۔ مہارتوں کا تبادلہ شروع کرنے کے لیے ان آسان اقدامات پر عمل کریں۔",
      "step1_title": "1. پروفائل بنائیں",
      "step1_description": "سائن اپ کریں اور اپنی پیش کردہ مہارتوں کی فہرست بنائیں۔ اعتماد پیدا کرنے کے لیے تصدیق کروائیں۔",
      "step2_title": "2. تلاش کریں اور تبادلہ کریں",
      "step2_description": "اپنی مطلوبہ مہارتیں براؤز کریں، یا درخواست پوسٹ کریں۔ تبادلے کا انتظام کرنے کے لیے دوسروں سے رابطہ کریں۔",
      "step3_title": "3. درجہ بندی کریں اور کمائیں",
      "step3_description": "تبادلہ مکمل کریں، رائے دیں، اور اپنے تعاون کے لیے اسکل پوائنٹس حاصل کریں۔",

      "featured_skills_title": "نمایاں مہارتیں",
      "view_all_link": "تمام دیکھیں →",
      "view_details_link": "تفصیلات دیکھیں →",

      "testimonials_title": "ہماری کمیونٹی کیا کہتی ہے",
      "testimonial1_quote": "میں نے اپنے پڑوسی کے واٹر پمپ کو ٹھیک کیا، اور بدلے میں، ان کی بیوی نے میری بیٹی کو کڑھائی سکھائی۔ گڈ کام – اسکل سویپ نے یہ ممکن بنایا۔ یہ ہمارے گاؤں کے لیے ایک نعمت ہے۔",
      "testimonial1_author_name": "اقبال حسین",
      "testimonial1_author_details": "میکینک، پنجاب",
      "testimonial2_quote": "ایک عورت کے طور پر، کام تلاش کرنا ہمیشہ آسان نہیں ہوتا۔ خواتین کے لیے مخصوص زون کے ذریعے، مجھے اپنی سلائی کی مہارت پیش کرنے اور ایک اور عورت سے اکاؤنٹنگ سیکھنے کے لیے ایک محفوظ جگہ ملی۔",
      "testimonial2_author_name": "سمینہ اختر",
      "testimonial2_author_details": "ہوم شیف، سندھ",

      "women_zone_title": "خواتین کے لیے ایک محفوظ جگہ",
      "women_zone_description": "ہماری خواتین کے لیے مخصوص اسکل زون خواتین کو اعتماد کے ساتھ جوڑنے، سیکھنے اور مہارتوں کا تبادلہ کرنے کے لیے ایک محفوظ اور معاون ماحول فراہم کرتا ہے۔",
      "women_zone_button": "خواتین کے زون کو دریافت کریں",

      "footer_tagline": "مہارتوں کو جوڑ کر، بغیر پیسوں کے، کمیونٹیز کو بااختیار بنانا۔",
      "footer_quick_links": "فوری لنکس",
      "footer_support": "سپورٹ",
      "footer_follow_us": "ہمیں فالو کریں",
      "footer_copyright": "گڈ کام – اسکل سویپ پاکستان۔ تمام حقوق محفوظ ہیں۔",
      "footer_privacy_policy": "پرائیویسی پالیسی",
      "footer_terms_of_service": "سروس کی شرائط",

      "lang_en": "انگریزی",
      "lang_ur": "اردو",
      "lang_sd": "سنڌي",

      // --- New Signup Page Translations ---
      "signup_join_gadd_kaam": "گڈ کام میں شامل ہوں",
      "signup_start_offering_finding": "اپنی کمیونٹی میں ہنر پیش کرنے اور تلاش کرنے کے لیے ایک اکاؤنٹ بنائیں۔",
      "signup_firstName_label": "پہلا نام",
      "signup_firstName_placeholder": "آپ کا پہلا نام",
      "signup_lastName_label": "آخری نام",
      "signup_lastName_placeholder": "آپ کا آخری نام",
      "signup_profilePicture_label": "پروفائل تصویر",
      "signup_no_file_chosen": "کوئی فائل منتخب نہیں کی گئی۔",
      "signup_username_label": "صارف نام",
      "signup_username_placeholder": "صارف نام منتخب کریں",
      "signup_phoneNumber_label": "فون نمبر",
      "signup_email_label": "ای میل",
      "signup_dateOfBirth_label": "تاریخ پیدائش",
      "signup_cnicNumber_label": "شناختی کارڈ نمبر",
      "signup_cnicFrontPic_label": "شناختی کارڈ سامنے کی تصویر",
      "signup_cnicBackPic_label": "شناختی کارڈ پیچھے کی تصویر",
      "signup_password_label": "پاس ورڈ",
      "signup_confirmPassword_label": "پاس ورڈ کی تصدیق کریں",
      "signup_create_account_btn": "اکاؤنٹ بنائیں",
      "signup_already_have_account": "پہلے سے ہی اکاؤنٹ ہے؟",
      "signup_login_link": "لاگ ان کریں",

      // Signup Form Errors
      "signup_error_firstName_required": "پہلا نام درکار ہے۔",
      "signup_error_lastName_required": "آخری نام درکار ہے۔",
      "signup_error_profilePic_required": "پروفائل تصویر درکار ہے۔",
      "signup_error_username_required": "صارف نام درکار ہے۔",
      "signup_error_phoneNumber_required": "فون نمبر درکار ہے۔",
      "signup_error_email_required": "ای میل درکار ہے۔",
      "signup_error_dob_required": "تاریخ پیدائش درکار ہے۔",
      "signup_error_cnic_invalid": "شناختی کارڈ نمبر 13 ہندسوں کا ہونا چاہیے۔",
      "signup_error_cnicFrontPic_required": "شناختی کارڈ سامنے کی تصویر درکار ہے۔",
      "signup_error_cnicBackPic_required": "شناختی کارڈ پیچھے کی تصویر درکار ہے۔",
      "signup_error_password_required": "پاس ورڈ درکار ہے۔",
      "signup_error_confirmPassword_required": "پاس ورڈ کی تصدیق درکار ہے۔",
      "signup_error_passwords_mismatch": "پاس ورڈ میل نہیں کھاتے۔",
      "signup_success_message": "اکاؤنٹ کامیابی سے بن گیا!"
    }
  },
  sd: { // Sindhi translations - Placeholder. You will fill these later.
    translation: {
      "dark_mode_toggle": "اونداهي موڊ کي تبديل ڪريو",
      "change_language": "ٻولي تبديل ڪريو",
      "call_helpline": "هلپ لائن تي ڪال ڪريو",

      "navbar_marketplace": "مارڪيٽ پليس",
      "navbar_about_us": "اسان بابت",
      "navbar_women_zone": "خاتونن لاءِ مخصوص علائقو",
      "navbar_contact": "رابطو",
      "navbar_login_btn": "لاگ ان ٿيو",
      "navbar_signup_btn": "سائن اپ ٿيو",

      "hero_headline": "مهارتن جو تبادلو، مستقبل جي تعمير.",
      "hero_subtext": "گڊ ڪام – اسڪل سوائيپ پاڪستان هڪ اهڙي ڪميونٽي آهي جتي توهان پنهنجي صلاحيتن کي گهربل مدد لاءِ مٽائي سگهو ٿا، بغير ڪنهن پئسي جي.",
      "hero_offer_skill_btn": "مهارت پيش ڪريو",
      "hero_find_skill_btn": "مهارت ڳوليو",

      "how_it_works_title": "اهو ڪيئن ڪم ڪري ٿو",
      "how_it_works_subtitle": "اسان جي ڪميونٽي ۾ شامل ٿيڻ آسان آهي. مهارتن جو تبادلو شروع ڪرڻ لاءِ هيٺين سادي قدمن تي عمل ڪريو.",
      "step1_title": "1. پروفائل ٺاهيو",
      "step1_description": "سائن اپ ڪريو ۽ پنهنجي پيش ڪيل مهارتن جي لسٽ ٺاهيو. اعتماد پيدا ڪرڻ لاءِ تصديق ڪرايو.",
      "step2_title": "2. ڳوليو ۽ تبادلو ڪريو",
      "step2_description": "توهان کي گهربل مهارتون براؤز ڪريو، يا درخواست پوسٽ ڪريو. تبادلي جو انتظام ڪرڻ لاءِ ٻين سان رابطو ڪريو.",
      "step3_title": "3. درجه بندي ڪريو ۽ ڪمايو",
      "step3_description": "تبادلو مڪمل ڪريو، راءِ ڏيو، ۽ پنهنجي تعاون لاءِ اسڪل پوائنٽس حاصل ڪريو.",

      "featured_skills_title": "نمايان مهارتون",
      "view_all_link": "سڀ ڏسو →",
      "view_details_link": "تفصيل ڏسو →",

      "testimonials_title": "اسان جي ڪميونٽي ڇا چوي ٿي",
      "testimonial1_quote": "مون پنهنجي پاڙيسريءَ جو واٽر پمپ ٺيڪ ڪيو، ۽ ان جي بدلي ۾، سندس گهر واريءَ منهنجي ڌيءَ کي ڪڙهائي سکاري. گڊ ڪام – اسڪل سوائيپ اهو ممڪن ڪيو. اهو اسان جي ڳوٺ لاءِ هڪ نعمت آهي.",
      "testimonial1_author_name": "اقبال حسين",
      "testimonial1_author_details": "مڪينڪ، پنجاب",
      "testimonial2_quote": "هڪ عورت جي حيثيت سان، ڪم ڳولڻ هميشه آسان ناهي. عورتن لاءِ مخصوص علائقي ذريعي، مون کي پنهنجي سلائي جي مهارت پيش ڪرڻ ۽ هڪ ٻي عورت کان اڪائونٽنگ سکڻ لاءِ هڪ محفوظ جاءِ ملي.",
      "testimonial2_author_name": "ثمينا اختر",
      "testimonial2_author_details": "گھر جي رڌڻي، سنڌ",

      "women_zone_title": "خاتونن لاءِ هڪ محفوظ جاءِ",
      "women_zone_description": "اسان جو عورتن لاءِ مخصوص اسڪل زون عورتن کي اعتماد سان ڳنڍڻ، سکڻ ۽ مهارتن جو تبادلو ڪرڻ لاءِ هڪ محفوظ ۽ مددگار ماحول فراهم ڪري ٿو.",
      "women_zone_button": "خاتونن جي زون کي ڳوليو",

      "footer_tagline": "مهارتن کي ڳنڍڻ، بغير نقد، جي ذريعي ڪميونٽين کي بااختيار بڻائڻ.",
      "footer_quick_links": "تڪڙا لنڪ",
      "footer_support": "مدد",
      "footer_follow_us": "اسان جي پيروي ڪريو",
      "footer_copyright": "گڊ ڪام – اسڪل سوائيپ پاڪستان. سڀ حق محفوظ.",
      "footer_privacy_policy": "پرائيويسي پاليسي",
      "footer_terms_of_service": "سروس جون شرطون",

      "lang_en": "انگريزي",
      "lang_ur": "اردو",
      "lang_sd": "سنڌي",

      // --- New Signup Page Translations ---
      "signup_join_gadd_kaam": "گڊ ڪام ۾ شامل ٿيو",
      "signup_start_offering_finding": "توهان جي ڪميونٽي ۾ مهارتون پيش ڪرڻ ۽ ڳولڻ شروع ڪرڻ لاءِ هڪ اڪائونٽ ٺاهيو.",
      "signup_firstName_label": "پهريون نالو",
      "signup_firstName_placeholder": "توهان جو پهريون نالو",
      "signup_lastName_label": "آخري نالو",
      "signup_lastName_placeholder": "توهان جو آخري نالو",
      "signup_profilePicture_label": "پروفائل تصوير",
      "signup_no_file_chosen": "ڪابه فائل چونڊيل ناهي.",
      "signup_username_label": "يوزر نالو",
      "signup_username_placeholder": "هڪ يوزر نالو چونڊيو",
      "signup_phoneNumber_label": "فون نمبر",
      "signup_email_label": "اي ميل",
      "signup_dateOfBirth_label": "ڄمڻ جي تاريخ",
      "signup_cnicNumber_label": "سي اين آءِ سي نمبر",
      "signup_cnicFrontPic_label": "سي اين آءِ سي سامهون جي تصوير",
      "signup_cnicBackPic_label": "سي اين آءِ سي پٺيان جي تصوير",
      "signup_password_label": "پاسورڊ",
      "signup_confirmPassword_label": "پاسورڊ جي تصديق ڪريو",
      "signup_create_account_btn": "اڪائونٽ ٺاهيو",
      "signup_already_have_account": "اڳ ۾ ئي اڪائونٽ آهي؟",
      "signup_login_link": "لاگ ان ٿيو",

      // Signup Form Errors
      "signup_error_firstName_required": "پهريون نالو لازمي آهي.",
      "signup_error_lastName_required": "آخري نالو لازمي آهي.",
      "signup_error_profilePic_required": "پروفائل تصوير لازمي آهي.",
      "signup_error_username_required": "يوزر نالو لازمي آهي.",
      "signup_error_phoneNumber_required": "فون نمبر لازمي آهي.",
      "signup_error_email_required": "اي ميل لازمي آهي.",
      "signup_error_dob_required": "ڄمڻ جي تاريخ لازمي آهي.",
      "signup_error_cnic_invalid": "سي اين آءِ سي نمبر 13 عددن جو هجڻ گهرجي.",
      "signup_error_cnicFrontPic_required": "سي اين آءِ سي سامهون جي تصوير لازمي آهي.",
      "signup_error_cnicBackPic_required": "سي اين آءِ سي پٺيان جي تصوير لازمي آهي.",
      "signup_error_password_required": "پاسورڊ لازمي آهي.",
      "signup_error_confirmPassword_required": "پاسورڊ جي تصديق لازمي آهي.",
      "signup_error_passwords_mismatch": "پاسورڊ هڪجهڙا ناهن.",
      "signup_success_message": "اڪائونٽ ڪاميابي سان ٺاهيو ويو!"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;