# Navigation & information architecture

Decisions for the logged-in portal redesign. Source of truth for page modules in `src/pages/`.

## Current portal menu (as of 2026-10-26)

Sidebar (8 collapsed groups):

| Group | Items → portal page |
|---|---|
| Accounts Receivable | Payment Report → `GLNet/RptARPayment.php` · Online Payment Center → `GLNet/PaymentCenter.php` |
| Student Information | Student Profile → `CampusNet/ViewOwnStudProfile.php` · View Student Ledger of Accounts → `CampusNet/ViewStudentLedgerHAU.php` |
| Enrollment Support | College Self Enrollment → `CampusNet/SelfEnrollment.101.php` · Display Own Class Schedule → `CampusNet/ViewStudScheduleHAU.php` · Subject Schedule Inquiry → `CampusNet/SubjSchedInqCur.101.php` · Basic Ed Self Enrollment → `CampusNet/BEDSelfEnrollment.101.php` |
| Student Services | Faculty Performance Evaluation → `CampusNet/FacultyEvaluation.php` |
| Student Performance | Display Own Grades → `CampusNet/StudentGradeInquiry.php` · Display Own Class Records → `CampusNet/ViewStudClassRecord.php` |
| Library Support | Online Public Access Catalog → `CampusNet/CatInquiry6.php` |
| Question/Contribution Management | Online Examination → `CampusNet/OLExam.php` · Student Examinations/Reviews history → `CampusNet/QMStudExamHistory.php` |
| Utilities | Change Own Password → `Changepass.php` |

Header: Privacy Notice · Help (`OpenHelp('help/')`) · Account ▼ (View Profile, Change Password, Logout → `Login.php`) · Notifications.
Dashboard (`Main.php`): basic student info, class schedule, calendar with events, notifications, account security info.

### Problems found

- **Duplicates:** Student Profile = View Profile; Change Own Password = Change Password.
- **Groups named after offices, not tasks:** "Accounts Receivable", "Question/Contribution Management".
- **Related tasks split up:** the ledger and payments sit in different groups, and so do the schedule and grades.
- **Groups with only one item:** Student Services, Library Support, Utilities.
- **Irrelevant item shown:** Basic Ed Self Enrollment appears for college students.
- **No hint of contents:** every group starts collapsed.
- **Wordy labels:** "Display Own …", "View …".

## Standards applied

- **ISO 9241-110 (interaction principles):** fit the task, explain itself, match what users expect, keep the user in control, prevent and recover from errors.
- **ISO 9241-11 (usability):** effectiveness, efficiency, satisfaction. Measure success by fewer taps to reach common tasks.
- **WCAG 2.2 AA (accessibility):** 4.5:1 text contrast, 24px minimum targets (we use 44–48px), visible focus, no keyboard traps, works with screen readers.
- **Material 3 adaptive navigation:**
  - Compact (<600px): bottom navigation bar
  - Medium (600–839px): navigation rail
  - Expanded (≥840px): rail or full navigation drawer
  - The destinations are the same at every size.
- **Nielsen Norman Group:** label links clearly, keep the menu shallow, put the most-used tasks first.

## New structure (decided)

Four destinations, the same on every device:

| Destination | Contains (merged from) |
|---|---|
| **Home** | Today / next class · Balance due + Pay · Latest grades · Notifications + calendar. Data comes from `Main.php`, the schedule, the ledger and grades. |
| **Academics** | Tabs: **Schedule** (class schedule + subject schedule inquiry) · **Grades** (grades + class records) · **Enrollment** (college self enrollment) |
| **Finances** | Balance & ledger · Payment history · Pay online (opens Online Payment Center) |
| **Me** | Profile · Change password · Library catalog · Faculty evaluation · Help · Privacy notice · Log out |

- **Hidden:** Basic Ed Self Enrollment (college students only), Online Examination and Exam/Review history (unused).
- **Layout by screen size:** a bottom bar on phones, a navigation rail on tablets, and a navigation rail plus content panes on desktop. Phone and desktop get equal design priority.
- **Data loading:** preload in the background, so Home merges data from several portal pages without extra clicks. This depends on the session constraints below.

## Page inventory (from saved samples, 2026-10-26)

What each portal page actually contains, and where it goes in the new structure.
Every page is a `Form1` that POSTs back to itself, with hidden `txtAction` / `txtAutokey` fields. The "(Add/Edit/Delete)" in page titles is the system's generic naming; these pages are read-only for students.

| Portal page | Contains | New home |
|---|---|---|
| `Main.php` | Basic info (`#boxStudInfo`), current-term class schedule (code, block, subject, time from–to, days, room), event calendar (`#events_table`), notifications, account security (`#boxAcctSecurity`) | **Home**: next class / today, notifications, calendar |
| `CampusNet/StudentGradeInquiry.php` | Every term's grades (code, grade, units, description) with term header rows; pass/fail/drop summary; "NF" = no final grade yet | **Academics → Grades**: transcript by term + computed GWA |
| `CampusNet/ViewStudClassRecord.php` | Current-term subjects + instructor. Each row has `OpenRawScore(key, hash)`, which opens a detail view with class standing / exam components per period, transmuted value and current grade, plus prelim/midterm/final computed vs submitted | **Academics → Grades**: "This term" live grades; tap a subject to see its breakdown |
| `CampusNet/ViewStudScheduleHAU.php` | Student data + a schedule table. **Empty (0 units) when not yet enrolled in the upcoming term** | **Academics → Schedule**; fall back to the `Main.php` / ledger schedule when empty |
| `CampusNet/SubjSchedInqCur.101.php` | Search open classes for the enrollment term (department, block, subject code, class code) | **Academics → Enrollment** |
| `CampusNet/SelfEnrollment.101.php` | Redirects or errors outside the enrollment period | **Academics → Enrollment**: show an "Enrollment is closed" state |
| `CampusNet/ViewStudentLedgerHAU.php` | Student data; current subjects + schedule; **assessment** (tuition, misc, lab, other fees, total); **ledger** (type, due date, ref, remarks, debit, credit, running balance); **official receipts** (S.Y./sem, OR no., date, teller, remarks, amount) | **Finances**: balance, fee breakdown, transactions, receipts |
| `GLNet/RptARPayment.php` | Payments made: the same OR history as the ledger | **Dropped**, merged into Finances → Receipts |
| `GLNet/PaymentCenter.php` | Term + assessment template; balance per installment (Entrance, Prelim, MidTerm, Finals); other fees picker; Dragonpay channel + email; "PAY NOW!"; online payment history (date, amount, OR, status, notes) | **Finances → Pay**: restyle the original form in place, never automate it; online payment statuses feed Receipts |
| `CampusNet/ViewOwnStudProfile.php` | Personal data, family, enrollment history, education, extra-curricular, **documents submitted checklist**, work, training | **Me → Profile**; missing documents become a Home alert |
| `Changepass.php` | Username, old password, new password ×2; hidden policy fields (`txtReqAlphaNum`, `txtMinPWLength`, …) | **Me → Change password**, with the password rules shown inline |
| `CampusNet/FacultyEvaluation.php` | Current-term classes + faculty + status; each opens a rating form (4-point scale per criterion) | **Me → Faculty evaluation**; a pending evaluation becomes a Home reminder |
| `CampusNet/CatInquiry6.php` | Library catalog search (keyword / advanced, department, material type) | **Me → Library** |
| `CampusNet/OLExam.php`, `QMStudExamHistory.php` | Online exams; not used by students per the user | **Hidden** |
| `CampusNet/BEDSelfEnrollment.101.php` | Basic Ed enrollment | **Hidden** |

### Implementation notes

- **Opening details:** detail views (class record breakdown, faculty evaluation form) are opened by `javascript:` links that run page functions. From the extension, trigger them by calling `.click()` on the original link element, never by calling the functions directly, since content scripts run in a separate JS context.
- **Merged views:** Home needs `Main.php` + ledger (balance) + grades + class records. Ledger alone covers almost all of Finances.
- **Background loading:** not yet confirmed. If background `fetch()` is blocked, merged views fall back to showing each section with a link to open the original portal page.

## Session constraints (must respect)

- **One login at a time:** logging in anywhere else ends every other session.
- **Loading `Login.php` or the site root logs you out.** Never request it in the background. "Log out" is the only thing allowed to go there.
- **Expired sessions:** the portal redirects to `CampusNet/ShowError.php?ec=1204`. Detect this and show a friendly "Session ended — sign in again" screen.
- **To verify:** background `fetch()` of portal pages while the session is valid. A test while logged out returned ec=1204, so this is not yet confirmed either way.
- **Automated tabs lose the session (2026-10-26).** When a browser-automation tab clicks past `Main.php`, the next page returns ec=1204. This happened with the extension fully disabled and the classic login, while the same click works when the user does it by hand. Page structure is therefore studied from pages the user saves into `samples/`, which is gitignored because it holds personal data.
