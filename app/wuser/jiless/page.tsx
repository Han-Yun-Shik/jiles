"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";


export default function Jiless() {

  return (
    <div>
      <UserMenu />

      <div className="jil_biz_hdr">제주인재육성 장학금 신청</div>

      <div className="jil_biz_wrap">
        <div className="jil_biz_area">
          <div className="jil_content_div">사업목적 및 방향</div>
          <ul>
            <li className="jil_content_li">성적 우수 학생 및 경제적 취약계층 등 지역 출신 학생들에게 장학금 지원을 통해 학업 장려 및 제주지역의 우수 인재로 육성</li>
            <li className="jil_content_li">해외 인턴십 체계를 도입하여 제주 청년 대상 국제 경쟁력을 갖춘 학습 및 실무 경험을 제공함으로써 글로벌 혁신 역량 강화</li>
          </ul>

          <div className=" jil_content_li_mp">&nbsp;</div>
          <div className="jil_content_div">사업개요</div>
          <ul>
            <li className="jil_content_li">사업기간 : 2025년 1월 ~ 12월 </li>
            <li className="jil_content_li">사업대상 : 제주도민(고등학생 및 대학(원)생)</li>
          </ul>

          <div className=" jil_content_li_mp">&nbsp;</div>
          <div className="jil_content_div">주요사업</div>
          <ul>
            <li className="jil_content_li">제주인재육성 장학금 지원사업 운영</li>
            <li className="jil_content_li">제주인재육성 특별지정장학금 지원사업 운영</li>
            <li className="jil_content_li">글로벌 혁신역량 강화사업 추진</li>
            <li className="jil_content_li">제주인재육성 장학금 기부 문화 활성화 추진 등</li>
          </ul>

          <div className=" jil_content_li_mp">&nbsp;</div>
          <div className="jil_content_div">기대효과</div>
          <ul>
            <li className="jil_content_li">장학금 지원과 해외 인턴십 기회 제공을 통해 학업 성취도와 글로벌 역량 강화 및 가계부담 완화</li>
            <li className="jil_content_li">교육 불평등 해소와 제주 지역의 지속 가능한 발전 및 국제 경쟁력 제고에 기여</li>
          </ul>

          <div className=" jil_content_li_mp">&nbsp;</div>
          <div className="jil_content_div">그간의 성과</div>
          <ul>
            <li className="jil_content_li">2024년 「제주인재육성 장학금」 장학생 선발 및 지원 : 296명, 417백만원</li>
            <li className="jil_content_li">2024년 「제주인재육성 특별지정장학금」 기부심사 및 기탁식 운영 : 5건, 221백만원</li>
            <li className="jil_content_li">2024년 제주청년해외연수 운영 (미국, 20명 대상)</li>
          </ul>
          <div className="jil_biz_btn_area mt-5">
            <Link href="/wuser/jilessform" className="jil_biz_btn_lk_sc">성취장학금</Link>&nbsp;
            <Link href="/wuser/jilesjform" className="jil_biz_btn_lk_sc">재능장학금</Link>&nbsp;
            <Link href="/wuser/jileshform" className="jil_biz_btn_lk_sc">희망장학금</Link>
          </div>
        </div>
      </div>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
    </div>
  );
}