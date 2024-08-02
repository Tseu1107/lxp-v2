export const auth = "auth/login";
export const authInit = "auth/init";
export const authRecover = "auth/recover";
export const authRecoverSubmit = "auth/recover-submit";
export const mainInit = 'main/init';

export const videoActionLog = 'system/vlogs'

export const changePassword = "auth/change-password";

// ============================= School =============================
// teacher
export const schoolTeacherIndex = 'school/teacher/index'
export const schoolTeacherView = 'school/teacher/view'
export const schoolTeacherCreate = 'school/teacher/create'
export const schoolTeacherEdit = 'school/teacher/edit'
export const schoolTeacherDelete = 'school/teacher/delete'
export const schoolTeacherStatusChange = 'school/teacher/change-status'
export const schoolTeacherChangeUsername = 'school/teacher/change-username'
export const schoolTeacherChangePassword = 'school/teacher/change-password'
export const schoolTeacherChangeRole = 'school/teacher/change-role'
export const schoolTeacherInfo = 'school/teacher/change-info'

// class
export const schoolClassIndex = 'school/class/index'
export const schoolClassCreate = 'school/class/create'
export const schoolClassEdit = 'school/class/edit'
export const schoolClassDelete = 'school/class/delete'
export const schoolClassStudents = 'school/class/students'

export const studentBook = 'class/student-book/index'
export const studentBookEdit = 'class/student-book/edit'
export const studentBookContactPersons = 'class/student-book/contact-persons'
export const studentBookContactPersonCreate = 'class/student-book/contact-person-create'
export const studentBookContactPersonEdit = 'class/student-book/contact-person-edit'
export const studentBookContactPersonDelete = 'class/student-book/contact-person-delete'
export const studentBookRelations = 'class/student-book/relations'
export const studentBookRelationDelete = 'class/student-book/relation-delete'

// subject
export const schoolSubjectIndex = 'school/subject/index'
export const schoolSubjectCreate = 'school/subject/create'
export const schoolSubjectEdit = 'school/subject/edit'
export const schoolSubjectDelete = 'school/subject/delete'
export const schoolSubjectTeacher = 'school/subject/teacher'

// movement
export const movementInIndex = 'movement/in/index'
export const movementInCreate = 'movement/in/create'
export const movementInAvatar = 'movement/in/avatar'

// manager
export const managerGroupIndex = 'manager/group/index'
export const managerGroupCreate = 'manager/group/create'
export const managerGroupEdit = 'manager/group/edit'
export const managerGroupView = 'manager/group/view'
export const managerGroupDelete = 'manager/group/delete'
export const managerGroupClassroomLink = 'manager/group/classroom-link'

export const managerSuccessCoachIndex = 'manager/success-coach/index'
export const managerSuccessCoachInit = 'manager/success-coach/init'
export const managerSuccessCoachAddStudent = 'manager/success-coach/add-student'
export const managerSuccessCoachRemoveStudent = 'manager/success-coach/remove-student'


// staff
// export const schoolStaffIndex = 'api/employee/init'
// export const schoolStaffSubmit = 'api/employee/submit'
// export const schoolStaffEdit = 'api/employee/edit'
// export const schoolStaffDelete = 'api/employee/delete'
// export const schoolStaffView = 'api/employee/view'
// export const schoolStaffStatusChange = 'api/employee/change-status'
// export const schoolStaffLoginNameChange = 'api/employee/change-username'
// export const schoolStaffPasswordReset = 'api/employee/change-password'
// export const schoolStaffRoleChange = 'api/employee/change-roles'
// export const schoolStaffToTeacher = 'api/employee/to-teacher'

// ============================= Reference =============================
export const groupIndex = 'api/group/index';
export const groupCreate = 'api/group/create';
export const groupView = 'api/group/view';
export const groupEdit = 'api/group/edit';
export const groupDelete = 'api/group/delete';
export const groupEditData = 'api/group/edit-data';
export const groupAddUser = 'api/group/add-user';
export const groupDeleteUser = 'api/group/delete-user';
export const groupDeleteStudent = 'api/group/delete-student';
// ============================= Exam =============================
export const examIndex = 'api/s/exam/index';
export const examAddInit = 'api/s/exam/init';
export const examAddSubmit = 'api/s/exam/create';
export const examEditInit = 'api/s/exam/edit';
export const examDelete = 'api/s/exam/delete';
export const examChangeDuration = 'api/s/exam/change-duration';
export const examDuplicate = 'api/s/exam/duplicate';
export const examToggleStatus = 'api/s/exam/toggle-status';
export const examPublish = 'api/s/exam/publish';
export const examUnPublish = 'api/s/exam/unpublish';
export const examQuestions = 'api/s/exam/questions';
export const examSelect = 'api/s/exam/select';
export const examGroupQuestionCreate = 'api/s/exam/question-create';
export const examGroupQuestionEdit = 'api/s/exam/question-edit';
export const examCreateFromOtherVariant = 'api/s/exam/create-from-other-variant';
export const examCreateFromBluePrint = 'api/s/exam/create-from-blueprint';
export const examRemoveFromBluePrint = 'api/s/exam/remove-from-blueprint';
export const examQuestionSaveBluePrint = 'api/s/exam/question/publish-blueprint';
// ============================= Exam Print =============================
export const examPrintIndex = 'api/s/exam/exam-print-index';
export const examPrintAddInit = 'api/s/exam/init';
export const examPrintAddSubmit = 'api/s/exam/create';
export const examCheckCorrectAnswer = 'api/s/exam/check-correct-answers';
export const examGetCorrectAnswer = 'api/s/exam/pdf/correct';
export const examCheckExamPdf = 'api/s/exam/check-exam-pdf';
export const examGetExamPdf = 'api/s/exam/pdf/exam-print';
// ============================= Exam Template =============================
export const examTemplateIndex = 'api/s/exam/template/index';
export const examTemplateGradeSubject = 'api/s/exam/grade-subjects';
export const examTemplateCreate = 'api/s/exam/template/create';
export const examTemplateEdit = 'api/s/exam/template/edit';
export const examTemplateDelete = 'api/s/exam/template/delete';
export const examTemplatePublish = 'api/s/exam/template/publish';
export const examTemplateUnPublish = 'api/s/exam/template/unpublish';
export const examTemplateQuestions = 'api/s/exam/template-question/index';
export const examTemplateSelect = 'api/s/exam/template-question/select';
export const examTemplateQuestionCreate = 'api/s/exam/template-question/create';
export const examTemplateQuestionEdit = 'api/s/exam/template-question/edit';
export const examTemplateQuestionCreateFromOtherVariant = 'api/s/exam/template-question/create-from-other-variant';
export const examTemplateQuestionCreateFromBluePrint = 'api/s/exam/template-question/create-from-blueprint';
export const examTemplateQuestionRemoveFromBluePrint = 'api/s/exam/template-question/remove-from-blueprint';
export const examTemplateQuestionSaveBluePrint = 'api/s/exam/template-question/publish-blueprint';
export const examTemplateQuestionChangeOrder = 'api/s/exam/template-question/change-order';
export const examTemplateQuestionRemove = 'api/s/exam/template-question/question-remove';

// ===== Curriculum =====
export const curriculumPlan = 'api/curriculum/plan'
export const curriculumTopicInit = 'api/curriculum/topic-init'
export const curriculumTopicSubmit = 'api/curriculum/topic-submit'
export const curriculumTopicEdit = 'api/curriculum/topic-edit'
export const curriculumTopicDelete = 'api/curriculum/topic-delete'
export const curriculumTopicOrdering = 'api/curriculum/topic-ordering'
export const curriculumTopicToggleStatus = 'api/curriculum/topic-toggle-status'
export const curriculumDashboard = 'api/curriculum/dashboard'
export const curriculumParentTopics = 'api/curriculum/main-topics'
export const curriculumParentTopicSubmit = 'api/curriculum/main-topic-submit'

// ===== Online exam =====
export const examQuestionIndex = 'api/s/exam/question/index'
export const examQuestionButIndex = 'api/s/exam/question/but-index'
export const examQuestionCreate = 'api/s/exam/question/create'
export const examQuestionDetail = 'api/s/exam/question/detail'
export const examQuestionEdit = 'api/s/exam/question/edit'
export const examQuestionToggleStatus = 'api/s/exam/question/toggle-status'
export const examQuestionDelete = 'api/s/exam/question/delete'
export const examReport = 'api/s/exam/report/index'
export const examCalculateResult = 'api/s/exam/report/calculate-result'
export const examReopen = 'api/s/exam/report/reopen'
export const examAnalysis = 'api/s/exam/analysis/index'
export const examQuestionSetApproval = 'api/s/exam/question/set-approval'

// ===== course (admin) =====
export const courseInit = 'api/course/init'
export const courseReport = 'api/course/report/index'
export const courseReportUser = 'api/course/report/user'
export const courseReportUserOpen = 'api/course/report/user-open'
export const courseReportSyllabus = 'api/course/report/syllabus'
export const courseQuestionSelect = 'api/course/exam/question-select'

// ===== Podcast (admin) =====
export const podcastIndex = 'api/podcast/index'
export const podcastInit = 'api/podcast/init'
export const podcastCreate = 'api/podcast/create'
export const podcastEdit = 'api/podcast/edit'
export const podcastDelete = 'api/podcast/delete'
export const podcastToggleStatus = 'api/podcast/toggle-status'

// ===== Auth (student) =====
export const studentAuthRegister = 'api/student/estudent/auth/register'
export const studentRegisterVerify = 'api/student/estudent/auth/verify'
export const studentRegisterVerificationResend = 'api/student/estudent/auth/resend'

// ===== Podcast (student) =====
export const podcastStudentIndex = 'api/student/podcast/index'
export const podcastStudentOtherPodcast = 'api/student/podcast/other'

// ===== Webinar =====
export const webinarIndex = 'api/webinar/index'
export const webinarCreate = 'api/webinar/create'
export const webinarP2P = 'api/webinar/p2p'

// ===== Student Council =====
export const studentCouncilIndex = 'api/student/council/index'
export const studentCouncilInfo = 'api/student/council/info'
export const studentCouncilCancelRequest = 'api/student/council/cancel-request'
export const studentCouncilJoinRequest = 'api/student/council/join-request'
 
// ===== Student online lesson =====
export const onlineLessonIndex = 'api/student/course/index'
export const onlineLessonIndexRecommended = 'api/student/course/index-recommended'
export const onlineLessonSubjectDetail = 'api/student/course/subject-detail'
export const onlineLessonCourseInfo = 'api/student/course/info'
export const onlineLessonCoursePage = 'api/student/course/page'
export const onlineLessonCourseExamStart = 'api/student/exam/start'
export const onlineLessonExamQuestion = 'api/student/exam/questions'
// ===== Student online lesson =====
export const userProfile = 'api/user/profile/index'
export const userProfileDestroyAvatar = 'api/user/profile/delete/avatar'
export const userProfileUploadAvatar = 'api/user/profile/upload/avatar'
export const userProfileUploadBio = 'api/user/profile/upload/bio'

// ===== Student online lesson =====
export const dashboardExamIndex = 'api/dashboard/exam/index'
// ===== Student study plan =====
export const studentStudyPlanIndex = 'api/student/study-plan/index'
export const studentStudyPlanSubmit = 'api/student/study-plan/save'

// ===== Student crossword =====
export const studentCrosswordStart = 'api/student/course/crossword-start'
export const studentCrosswordData = 'api/student/course/crossword-data'
export const studentUpdateCrosswordData = 'api/student/course/update-crossword'
export const studentFinishCrossword = 'api/student/course/finish-crossword'
