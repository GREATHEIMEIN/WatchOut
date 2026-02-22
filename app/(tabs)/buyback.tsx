// 즉시매입 안내 페이지 — v5 BuybackPage 기반

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import BuybackSheet from '@/components/buyback/BuybackSheet';
import { COLORS, SPACING, RADIUS, BRANDS } from '@/lib/constants';

// FAQ 데이터
const FAQS = [
  { q: '어떤 브랜드를 매입하나요?', a: '롤렉스, 파텍필립, 오데마피게, 오메가, 까르띠에, IWC, 파네라이 등 주요 럭셔리 브랜드를 매입합니다. 그 외 브랜드도 문의 가능합니다.' },
  { q: '매입 가격은 어떻게 결정되나요?', a: '국내외 실거래 시세 데이터를 기반으로 최고가를 제시합니다. 시계의 상태, 구성품, 연식을 종합적으로 고려합니다.' },
  { q: '출장 가능 지역은 어디인가요?', a: '현재 서울·경기 전 지역에서 출장 매입이 가능합니다. 그 외 지역은 별도 문의해 주세요.' },
  { q: '입금은 얼마나 걸리나요?', a: '현장에서 최종 금액 합의 후 즉시 계좌이체로 입금됩니다. 평균 10분 이내 완료됩니다.' },
];

// 매입 진행 과정
const PROCESS_STEPS = [
  { step: 1, icon: '📸', title: '시계 정보 입력', desc: '브랜드, 모델, 사진을 보내주세요', time: '30초' },
  { step: 2, icon: '📞', title: '전문가 연락', desc: '빠른 시간 내에 연락드립니다', time: '당일' },
  { step: 3, icon: '🚗', title: '출장 방문', desc: '원하시는 시간·장소로 방문합니다', time: '협의' },
  { step: 4, icon: '🔍', title: '현장 감정', desc: '실물 확인 후 최종 금액을 제시합니다', time: '10분' },
  { step: 5, icon: '💸', title: '즉시 입금', desc: '합의 즉시 계좌이체 완료', time: '즉시' },
];

// 왜 WATCHOUT인가요 데이터
const WHY_ITEMS = [
  { icon: '📊', title: '데이터 기반 최고가', desc: '국내외 시세를 실시간 분석하여 최고가를 제시합니다' },
  { icon: '🏠', title: '편리한 출장 매입', desc: '원하시는 시간과 장소로 직접 찾아갑니다' },
  { icon: '⚡', title: '빠른 현금화', desc: '현장에서 즉시 계좌이체로 바로 현금화' },
  { icon: '🛡️', title: '안전한 거래', desc: '전문 감정사가 함께하여 안전하게 거래합니다' },
];

// 매입 가능 브랜드 (BRANDS + 기타)
const BRAND_TAGS = [...BRANDS, '기타 문의'];

export default function BuybackScreen() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Header title="즉시매입" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero 섹션 */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Text style={{ fontSize: 36 }}>💰</Text>
          </View>
          <Text style={styles.heroTitle}>찾아가서 최고가로{'\n'}즉시 매입합니다</Text>
          <Text style={styles.heroDesc}>
            사진 몇 장이면 끝. 전문가가 직접 방문하여{'\n'}현장 감정 후 즉시 입금해 드립니다.
          </Text>
        </View>

        {/* Trust Badges */}
        <View style={styles.badgeRow}>
          {[
            { icon: '🚗', title: '출장 방문', desc: '원하시는\n장소로 방문' },
            { icon: '🔍', title: '현장 감정', desc: '전문가가\n즉석 진단' },
            { icon: '💸', title: '즉시 입금', desc: '합의 후\n바로 이체' },
          ].map((badge) => (
            <View key={badge.title} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
            </View>
          ))}
        </View>

        {/* 매입 진행 과정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>매입 진행 과정</Text>
          <View style={styles.timeline}>
            {PROCESS_STEPS.map((item, index) => (
              <View key={item.step}>
                <View style={styles.timelineItem}>
                  {/* 좌측: 번호 원형 */}
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                  </View>
                  {/* 우측: 정보 */}
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineIcon}>{item.icon}</Text>
                      <Text style={styles.timelineTitle}>{item.title}</Text>
                      <View style={styles.timeTag}>
                        <Text style={styles.timeTagText}>{item.time}</Text>
                      </View>
                    </View>
                    <Text style={styles.timelineDesc}>{item.desc}</Text>
                  </View>
                </View>
                {/* 세로 연결선 */}
                {index < PROCESS_STEPS.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 왜 WATCHOUT인가요 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>왜 WATCHOUT인가요?</Text>
          {WHY_ITEMS.map((item) => (
            <View key={item.title} style={styles.whyCard}>
              <View style={styles.whyIcon}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              </View>
              <View style={styles.whyContent}>
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 매입 가능 브랜드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>매입 가능 브랜드</Text>
          <View style={styles.brandTagWrap}>
            {BRAND_TAGS.map((brand) => (
              <View key={brand} style={styles.brandTag}>
                <Text style={styles.brandTagText}>{brand}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>자주 묻는 질문</Text>
          {FAQS.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleFaq(index)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Ionicons
                  name={faqOpen === index ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.sub}
                />
              </View>
              {faqOpen === index && (
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA 버튼 */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => setSheetVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>즉시매입 신청하기</Text>
          </TouchableOpacity>
          <Text style={styles.ctaHint}>사진 3장이면 충분해요 · 평균 30초 소요</Text>
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BuybackSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  heroDesc: {
    fontSize: 13,
    color: COLORS.sub,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  // Trust Badges
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: 10,
    color: COLORS.sub,
    textAlign: 'center',
    lineHeight: 14,
  },
  // 공통 섹션
  section: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  // 타임라인
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.border,
    marginLeft: 15,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timelineIcon: {
    fontSize: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  timeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: COLORS.tag,
  },
  timeTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.sub,
  },
  timelineDesc: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 4,
  },
  // 왜 WATCHOUT
  whyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyContent: {
    flex: 1,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  whyDesc: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 2,
  },
  // 브랜드 태그
  brandTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  brandTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  brandTagText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  // FAQ
  faqItem: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  faqAnswer: {
    fontSize: 13,
    color: COLORS.sub,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  // CTA
  ctaSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.text,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaHint: {
    fontSize: 11,
    color: COLORS.sub,
    marginTop: SPACING.sm,
  },
});
