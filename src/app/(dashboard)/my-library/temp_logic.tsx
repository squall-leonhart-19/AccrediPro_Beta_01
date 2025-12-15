const handleNextChapter = (ebookId: string, currentChapterIndex: number, totalChapters: number) => {
    setReadingProgress((prev) => {
        const existing = prev[ebookId] || { currentChapter: 0, completedChapters: [], lastRead: "", started: false };

        // 1. Mark current complete
        const completed = existing.completedChapters.includes(currentChapterIndex)
            ? existing.completedChapters
            : [...existing.completedChapters, currentChapterIndex];

        // 2. Move to next chapter
        const nextIndex = currentChapterIndex + 1;

        const updatedEbookProgress = {
            ...existing,
            completedChapters: completed,
            currentChapter: nextIndex,
            lastRead: new Date().toISOString(),
            started: true,
        };

        saveProgressToDb(ebookId, updatedEbookProgress);

        return {
            ...prev,
            [ebookId]: updatedEbookProgress
        };
    });

    setCurrentChapter(currentChapterIndex + 1);
};
