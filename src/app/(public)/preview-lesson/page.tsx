"use client";

import { LessonWhatIsFMV4 } from "@/components/mini-diploma/lessons/lesson-what-is-fm-v4";

export default function PreviewLessonPage() {
    return (
        <LessonWhatIsFMV4
            lessonNumber={1}
            totalLessons={9}
            isPaid={false}
            checkoutUrl="https://sarah.accredipro.academy/fm-mini-diploma-access"
        />
    );
}
