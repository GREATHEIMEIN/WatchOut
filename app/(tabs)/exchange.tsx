// 교환거래 안내 페이지

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/common/Header';
import ExchangeSheet from '@/components/exchange/ExchangeSheet';
import { COLORS, SPACING, RADIUS } from '@/lib/constants';

// 교환거래 전용 디자인 색상
const EXCHANGE = {
  primary: '#1A1A2E',   // 다크 네이비
  accent: '#C9A84C',    // 골드
  surface: '#F8F6F1',   // 웜 그레이
  border: '#E5E2DB',    // 웜 보더
  accentLight: 'rgba(201,168,76,0.15)',
};

// FAQ 데이터
const FAQS = [
  {
    q: '교환 거래는 어떻게 진행되나요?',
    a: '교환 신청 후 전문가가 내 시계와 원하는 시계의 시세를 비교합니다. 1~2 영업일 내로 최적의 딜을 제안해 드리며, 합의 후 거래가 진행됩니다.',
  },
  {
    q: '교환 시 추가 금액이 발생하나요?',
    a: '시계 간 시세 차이에 따라 추가 금액이 발생할 수 있습니다. 전문가가 국내외 실거래 시세를 기반으로 공정한 금액을 제안합니다.',
  },
  {
    q: '목록에 없는 모델도 교환 가능한가요?',
    a: '네, 가능합니다. "기타" 브랜드를 선택하여 직접 입력하시거나, 추가 요청사항에 상세히 기재해 주세요. 모든 럭셔리 시계 브랜드 검토 가능합니다.',
  },
  {
    q: '검토 기간은 얼마나 걸리나요?',
    a: '신청 후 1~2 영업일 이내에 담당자가 연락드립니다. 시세 확인 및 검토 후 맞춤형 교환 딜을 제시해 드립니다.',
  },
];

// 진행 과정 4단계
const PROCESS_STEPS = [
  { step: '01', icon: '📝', title: '교환 신청', desc: '교환할 시계와 원하는 시계 정보를 입력합니다' },
  { step: '02', icon: '🔍', title: '전문가 검토', desc: '시세 분석 후 최적의 딜을 검토합니다', time: '1~2 영업일' },
  { step: '03', icon: '💎', title: '딜 제시', desc: '시세 기반의 공정한 교환 조건을 제안합니다' },
  { step: '04', icon: '🤝', title: '거래 확정', desc: '조건 합의 후 안전하게 거래를 진행합니다' },
];

// 왜 WATCHOUT 교환거래
const WHY_ITEMS = [
  { icon: '📊', title: '실시간 시세 반영', desc: '국내외 시세 데이터 기반 공정한 교환 비율' },
  { icon: '🛡️', title: '정품 감정 보증', desc: '전문 감정사가 직접 진품 여부를 확인' },
  { icon: '⚡', title: '빠른 검토', desc: '1~2 영업일 내 담당자 연락 보장' },
  { icon: '🔄', title: '업그레이드 기회', desc: '보유 시계로 원하는 모델로 손쉽게 교환' },
];

// 교환 가능 브랜드
const EXCHANGE_BRANDS = [
  'Rolex', 'Omega', 'AP', 'Patek Philippe', 'Cartier',
  'IWC', 'Panerai', 'Tudor', 'Breitling', 'Hublot',
];

export default function ExchangeScreen() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Header title="교환거래" dark />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero 섹션 */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>WATCHOUT EXCHANGE</Text>
          </View>
          <View style={styles.heroIconBox}>
            <Ionicons name="repeat" size={40} color={EXCHANGE.accent} />
          </View>
          <Text style={styles.heroTitle}>원하는 시계로{'\n'}교환하세요</Text>
          <Text style={styles.heroDesc}>
            보유 시계를 등록하면 전문가가 검토 후{'\n'}최적의 교환 딜을 제시해드립니다
          </Text>
          <TouchableOpacity
            style={styles.heroCta}
            onPress={() => setSheetVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.heroCtaText}>교환 신청하기</Text>
            <Ionicons name="arrow-forward" size={16} color={EXCHANGE.primary} />
          </TouchableOpacity>
        </View>

        {/* Trust Badges */}
        <View style={styles.badgeRow}>
          {[
            { icon: '🔒', title: '안전 거래', desc: '에스크로\n보호' },
            { icon: '👨‍💼', title: '전문 감정', desc: '정품\n보증' },
            { icon: '💎', title: '합리적 딜', desc: '시세 기반\n제안' },
          ].map((badge) => (
            <View key={badge.title} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
            </View>
          ))}
        </View>

        {/* 진행 과정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>교환 진행 과정</Text>
          <View style={styles.timeline}>
            {PROCESS_STEPS.map((item, index) => (
              <View key={item.step} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                  </View>
                  {index < PROCESS_STEPS.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineIcon}>{item.icon}</Text>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    {item.time && (
                      <View style={styles.timeTag}>
                        <Text style={styles.timeTagText}>{item.time}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.timelineDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 왜 WATCHOUT 교환거래 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>왜 WATCHOUT 교환거래인가요?</Text>
          <View style={styles.whyGrid}>
            {WHY_ITEMS.map((item) => (
              <View key={item.title} style={styles.whyCard}>
                <Text style={styles.whyIcon}>{item.icon}</Text>
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 교환 가능 브랜드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>교환 가능 브랜드</Text>
          <View style={styles.brandTagWrap}>
            {EXCHANGE_BRANDS.map((brand) => (
              <View key={brand} style={styles.brandTag}>
                <Text style={styles.brandTagText}>{brand}</Text>
              </View>
            ))}
            <View style={[styles.brandTag, styles.brandTagMore]}>
              <Text style={[styles.brandTagText, { color: COLORS.sub }]}>기타 문의</Text>
            </View>
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
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Ionicons
                  name={faqOpen === index ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.sub}
                />
              </View>
              {faqOpen === index && (
                <Text style={styles.faqA}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 하단 CTA 배너 */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaBannerTitle}>시계 교환, 지금 시작하세요</Text>
          <Text style={styles.ctaBannerSub}>전문가가 최적의 딜을 찾아드립니다</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => setSheetVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>교환 신청하기</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <ExchangeSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
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
    backgroundColor: EXCHANGE.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: EXCHANGE.accent,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: SPACING.base,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: EXCHANGE.primary,
    letterSpacing: 1,
  },
  heroIconBox: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: EXCHANGE.accentLight,
    borderWidth: 1.5,
    borderColor: EXCHANGE.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: SPACING.sm,
  },
  heroDesc: {
    fontSize: 14,
    color: '#B8BCC8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: EXCHANGE.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
  },
  heroCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: EXCHANGE.primary,
  },

  // Trust Badges
  badgeRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    gap: SPACING.sm,
    backgroundColor: EXCHANGE.surface,
    borderBottomWidth: 1,
    borderBottomColor: EXCHANGE.border,
  },
  badgeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  badgeIcon: {
    fontSize: 22,
    marginBottom: 4,
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

  // 섹션
  section: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.base,
  },

  // 타임라인
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
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
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    minHeight: 28,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: SPACING.base,
    paddingTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  timelineIcon: {
    fontSize: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  timeTag: {
    backgroundColor: EXCHANGE.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.tag,
    borderWidth: 1,
    borderColor: EXCHANGE.accent,
  },
  timeTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: EXCHANGE.accent,
  },
  timelineDesc: {
    fontSize: 12,
    color: COLORS.sub,
    lineHeight: 18,
  },

  // 왜 WATCHOUT (2x2 그리드)
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  whyCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },
  whyIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  whyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  whyDesc: {
    fontSize: 11,
    color: COLORS.sub,
    lineHeight: 16,
  },

  // 브랜드 태그
  brandTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  brandTag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.tag,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brandTagMore: {
    backgroundColor: COLORS.tag,
  },
  brandTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
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
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
  },
  faqA: {
    marginTop: SPACING.sm,
    fontSize: 13,
    color: COLORS.sub,
    lineHeight: 20,
  },

  // 하단 CTA 배너
  ctaBanner: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: EXCHANGE.primary,
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  ctaBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  ctaBannerSub: {
    fontSize: 13,
    color: '#B8BCC8',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: EXCHANGE.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 13,
    borderRadius: RADIUS.button,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: EXCHANGE.primary,
  },
});
