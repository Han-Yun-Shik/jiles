// components/AdminMenu.tsx
import Link from "next/link";

export default function UserMenu() {
    return (
        <>
            <div className="jil_biz_top_wrap">
                <Link href="/" className="jil_biz_t_btn">Home2</Link>
                <Link href="/wuser/plogin" className="jil_biz_t_btn">접수확인</Link>
                <Link href="/wadm/slist" className="jil_biz_t_btn">관리설정</Link>
            </div>
        </>
    );
}
