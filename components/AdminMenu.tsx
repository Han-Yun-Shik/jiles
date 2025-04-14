// components/AdminMenu.tsx
import Link from "next/link";

export default function AdminMenu() {
  return (
    <>
      <div className="jil_adm_top_wrap">
        <div className="jil_adm_hdr_title">신청자 관리</div>
        <div style={{ textAlign: "right" }}>
          <Link href="/wadm/slist" className="jil_adm_t_btn jil_adm_mr_2">
            관리자 홈
          </Link>
          <Link href="/" className="jil_adm_t_btn_logout jil_adm_mr_2">
            사용자 홈
          </Link>
        </div>
      </div>

      <div className="jil_adm_hdr_wrap">
        <div>&nbsp;</div>
        <div className="jil_adm_hdr_mid bg-secondary-subtle">
          <Link href="/wadm/slist" className="jil_adm_menu_lk jil_adm_mr_2">
            성취장학금
          </Link>
        </div>
        <div>&nbsp;</div>
      </div>
    </>
  );
}
