import { View, Text, ScrollView } from 'react-native';
import { RecommendScreenHeader } from '@/components/RecommendScreenHeader';
import { RecommendCard } from '@/components/RecommendCard';

export default function PestDiseaseRecommendation() {
  return (
    <View className="flex-1 bg-[#34643F]">
      <RecommendScreenHeader activeCategory="pest" />
      <View className="flex-1 bg-[#F8F8F0] rounded-t-3xl pt-6 px-4 pb-8">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <Text className="text-[#34643F] text-lg font-bold">Pest & Disease Recommendations</Text>
        </View>
        <Text className="text-gray-500 text-sm mb-5">Detect issues early and protect your crops.</Text>

        <ScrollView showsVerticalScrollIndicator={false} className="gap-3">
          <RecommendCard
            title="Detected Issue"
            value="No active disease detected for sorghum"
            icon="warning"
            iconColor="#EAB308"
          />
          <RecommendCard
            title="Pest Risk"
            value="Monitor for stem borer and shoot fly on young plants"
            icon="bug"
            iconColor="#92400E"
          />
          <RecommendCard
            title="Pesticide Recommendation"
            value="Neem-based botanical spray or locally approved pyrethroid"
            icon="leaf"
            iconColor="#34643F"
          />
          <RecommendCard
            title="Application Rate"
            value="Spray affected leaves and stems lightly; follow product label"
            icon="flask-outline"
            iconColor="#34643F"
          />
          <RecommendCard
            title="Preventive Measures"
            value="Remove affected shoots | Rotate with beans or groundnuts"
            icon="checkmark-done-circle"
            iconColor="#22C55E"
          />
          <RecommendCard
            title="Spraying Schedule"
            value="Inspect after 7 days; repeat only if new damage appears"
            icon="time-outline"
            iconColor="#9CA3AF"
          />
        </ScrollView>
      </View>
    </View>
  );
}
