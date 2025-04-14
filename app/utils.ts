export const REGDATE_STR = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 8) return "";

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    return `${year}-${month}-${day}`;
};
export const WR_STATE_ARR: { [key: number]: string } = {
    1: "접수",
    2: "완료",
};
export const WR_GENDER_ARR: { [key: string]: string } = {
    "M": "남",
    "W": "여",
};
export const WR_GUBUN_ARR: { [key: string]: string } = {
    "gubuns": "성취장학금",
    "gubunj": "재능장학금",
    "gubunh": "희망장학금",
};
export const WR_SCATE_ARR: { [key: string]: string } = {
    "scate1": "성취장학금(대학신입생)",
    "scate2": "성취장학금(대학재학생)",
    "scate3": "성취장학금(대학원석사재학생)",
};
export const WR_JCATE_ARR: { [key: string]: string } = {
    "jcate1": "재능장학금(도내고교생)",
    "jcate2": "재능장학금(국내대학생)",
};
export const WR_HCATE_ARR: { [key: string]: string } = {
    "hcate1": "고등학생",
    "hcate2": "대학신입생",
    "hcate3": "대학재학생",
    "hcate4": "비정규학교 등 평생교육시설 고교학력과정 재학생",
};