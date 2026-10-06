-- 다른 사용자 풍등 피드에 차 종류를 보여주기 위해 tea 컬럼을 추가한다.
-- 값은 tea 도메인이 정한 차 id. id 목록이 확정되면 check 제약을 추가한다.
alter table lanterns add column tea text not null;
