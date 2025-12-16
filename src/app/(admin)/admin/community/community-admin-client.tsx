"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  Heart,
  Trophy,
  GraduationCap,
  Plus,
  Send,
  Calendar,
  Sparkles,
  FileText,
  ChevronRight,
  Check,
  Loader2,
  Eye,
  ThumbsUp,
  Search,
} from "lucide-react";

interface FakeProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  email: string | null;
}

interface SarahProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
}

interface RecentPost {
  id: string;
  title: string;
  categoryId: string | null;
  createdAt: Date;
  likeCount: number;
  reactions: Record<string, number> | null; // Stored reactions JSON from DB
  author: {
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

interface CommunityAdminClientProps {
  fakeProfiles: FakeProfile[];
  sarahProfile: SarahProfile | null;
  recentPosts: RecentPost[];
  stats: {
    totalPosts: number;
    totalComments: number;
    totalFakeProfiles: number;
    winsPosts: number;
    graduatesPosts: number;
    coachingTipsPosts: number;
    questionsPosts: number;
    careerPosts: number;
    totalLikes: number;
  };
}

// Pre-defined comment templates for Sarah
const SARAH_COMMENT_TEMPLATES = [
  "Amazing progress, {name}! This is exactly what we love to see in our community. Keep up the incredible work!",
  "{name}, you're absolutely crushing it! Your dedication is inspiring to everyone here.",
  "So proud of you, {name}! This is what transformation looks like. Can't wait to see what's next!",
  "This is beautiful, {name}! Your journey is going to inspire so many others in our community.",
  "Wow {name}, look at you go! This is exactly why I love being part of this community.",
  "{name}, this made my day! You're proof that the work pays off. Keep shining!",
  "Incredible milestone, {name}! Your hard work and commitment are truly showing.",
  "YES {name}! This is what it's all about. So honored to be part of your journey!",
  "{name}, you're an absolute rockstar! Thank you for sharing this with us.",
  "This is amazing, {name}! Your transformation story is going to help so many people.",
];

// Pre-defined community member comment templates
const MEMBER_COMMENT_TEMPLATES = [
  "This is so inspiring! Congratulations!",
  "Amazing work! You're such an inspiration to all of us!",
  "So happy for you! Keep crushing it!",
  "This made my day! Congratulations on your success!",
  "Wow, incredible progress! You deserve all this success!",
  "This is exactly what I needed to see today. Thank you for sharing!",
  "Congratulations! Your story is so motivating!",
  "Love seeing posts like this! You're doing amazing!",
  "So proud of you! This is beautiful!",
  "Amazing! You're an inspiration to the whole community!",
];

const REACTION_EMOJIS = ["❤️", "🔥", "👏", "🎉", "💪", "⭐"];

export default function CommunityAdminClient({
  fakeProfiles,
  sarahProfile,
  recentPosts,
  stats,
}: CommunityAdminClientProps) {
  // Create post state
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [postCategory, setPostCategory] = useState<string>("wins");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postDate, setPostDate] = useState(new Date().toISOString().split("T")[0]);
  const [viewCount, setViewCount] = useState("150");
  const [likeCount, setLikeCount] = useState("25");
  const [addSarahComment, setAddSarahComment] = useState(true);
  const [sarahComment, setSarahComment] = useState("");
  const [commentsToGenerate, setCommentsToGenerate] = useState("3");
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Add to existing post state
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [addCommentType, setAddCommentType] = useState<"sarah" | "member">("sarah");
  const [existingPostComment, setExistingPostComment] = useState("");
  const [setExactLikes, setSetExactLikes] = useState(""); // Empty = don't change, number = set to exact value
  const [isAddingToPost, setIsAddingToPost] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Individual reaction editing state
  const [editReactions, setEditReactions] = useState<Record<string, number>>({});

  // Bulk add reactions state
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [bulkAddSuccess, setBulkAddSuccess] = useState(false);

  const handleBulkAddReactions = async () => {
    if (!confirm("This will add 4-19 random reactions to ALL posts. Continue?")) {
      return;
    }

    setIsBulkAdding(true);
    try {
      const response = await fetch("/api/admin/community/bulk-add-reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minAdd: 4, maxAdd: 19 }),
      });

      if (!response.ok) throw new Error("Failed to bulk add reactions");

      const data = await response.json();
      setBulkAddSuccess(true);
      setTimeout(() => {
        setBulkAddSuccess(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error bulk adding reactions:", error);
      alert("Failed to bulk add reactions");
    } finally {
      setIsBulkAdding(false);
    }
  };

  const filteredPosts = recentPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      `${post.author.firstName} ${post.author.lastName}`.toLowerCase().includes(postSearchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedPost = recentPosts.find((p) => p.id === selectedPostId);

  const handleCreatePost = async () => {
    if (!selectedProfile || !postTitle || !postContent) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/community/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: selectedProfile,
          category: postCategory,
          title: postTitle,
          content: postContent,
          createdAt: postDate,
          viewCount: parseInt(viewCount),
          likeCount: parseInt(likeCount),
          addSarahComment,
          sarahComment: sarahComment || undefined,
          commentsToGenerate: parseInt(commentsToGenerate),
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      setCreateSuccess(true);
      // Reset form
      setPostTitle("");
      setPostContent("");
      setSarahComment("");
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddToExistingPost = async () => {
    if (!selectedPostId) {
      alert("Please select a post");
      return;
    }

    setIsAddingToPost(true);
    try {
      // Build reactions object if any are being edited
      const hasReactionEdits = Object.keys(editReactions).length > 0;

      const response = await fetch("/api/admin/community/add-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: selectedPostId,
          addComment: existingPostComment ? true : false,
          commentType: addCommentType,
          commentContent: existingPostComment || undefined,
          // Pass the edited reactions directly
          setReactions: hasReactionEdits ? editReactions : undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to add interactions");

      setAddSuccess(true);
      setExistingPostComment("");
      setEditReactions({});
      setTimeout(() => {
        setAddSuccess(false);
        // Refresh page to show updated counts
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding interactions:", error);
      alert("Failed to add interactions");
    } finally {
      setIsAddingToPost(false);
    }
  };

  const getCategoryBadge = (categoryId: string | null) => {
    switch (categoryId) {
      case "wins":
        return <Badge className="bg-amber-100 text-amber-700">Wins</Badge>;
      case "graduates":
        return <Badge className="bg-emerald-100 text-emerald-700">Graduate</Badge>;
      case "introductions":
        return <Badge className="bg-pink-100 text-pink-700">Intro</Badge>;
      case "coaching-tips":
        return <Badge className="bg-green-100 text-green-700">Tips</Badge>;
      case "questions-everyone-has":
        return <Badge className="bg-blue-100 text-blue-700">Questions</Badge>;
      case "career-pathway":
        return <Badge className="bg-purple-100 text-purple-700">Career</Badge>;
      default:
        return <Badge variant="secondary">{categoryId}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Community Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create posts, add comments, and manage community interactions
          </p>
        </div>
        <Button
          onClick={handleBulkAddReactions}
          disabled={isBulkAdding}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          {isBulkAdding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding to all posts...
            </>
          ) : bulkAddSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              +4-19 Reactions to ALL Posts
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-burgundy-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-burgundy-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.totalPosts.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.totalComments.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">Comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.winsPosts}</p>
                <p className="text-[10px] text-gray-500">Wins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.graduatesPosts}</p>
                <p className="text-[10px] text-gray-500">Graduates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.coachingTipsPosts}</p>
                <p className="text-[10px] text-gray-500">Tips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.questionsPosts}</p>
                <p className="text-[10px] text-gray-500">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.careerPosts}</p>
                <p className="text-[10px] text-gray-500">Career</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.totalFakeProfiles}</p>
                <p className="text-[10px] text-gray-500">Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="create" className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Post
          </TabsTrigger>
          <TabsTrigger value="existing" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Add to Existing
          </TabsTrigger>
        </TabsList>

        {/* Create New Post Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Post Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  Create Community Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile & Category Selection */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Profile *</Label>
                    <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a profile..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {fakeProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={profile.avatar || undefined} />
                                <AvatarFallback className="text-xs">
                                  {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{profile.firstName} {profile.lastName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={postCategory} onValueChange={setPostCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wins">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            Share Your Wins
                          </div>
                        </SelectItem>
                        <SelectItem value="graduates">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-emerald-500" />
                            New Graduates
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label>Post Title *</Label>
                  <Input
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g., Just signed my 10th client!"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>Post Content * (HTML supported)</Label>
                  <Textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Write the post content... Use <p>, <strong>, <ul><li> tags for formatting."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                {/* Date & Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Post Date
                    </Label>
                    <Input
                      type="date"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Count
                    </Label>
                    <Input
                      type="number"
                      value={viewCount}
                      onChange={(e) => setViewCount(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Like Count
                    </Label>
                    <Input
                      type="number"
                      value={likeCount}
                      onChange={(e) => setLikeCount(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                {/* Sarah Comment */}
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={sarahProfile?.avatar || "/coaches/sarah-coach.webp"} />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      Add Sarah&apos;s Comment
                    </Label>
                    <input
                      type="checkbox"
                      checked={addSarahComment}
                      onChange={(e) => setAddSarahComment(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </div>
                  {addSarahComment && (
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {SARAH_COMMENT_TEMPLATES.slice(0, 5).map((template, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              const profile = fakeProfiles.find(p => p.id === selectedProfile);
                              const name = profile?.firstName || "there";
                              setSarahComment(template.replace("{name}", name));
                            }}
                          >
                            Template {idx + 1}
                          </Button>
                        ))}
                      </div>
                      <Textarea
                        value={sarahComment}
                        onChange={(e) => setSarahComment(e.target.value)}
                        placeholder="Custom Sarah comment (or leave empty for random)"
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                </div>

                {/* Auto Comments */}
                <div className="space-y-2">
                  <Label>Auto-generate Member Comments</Label>
                  <Select value={commentsToGenerate} onValueChange={setCommentsToGenerate}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="1">1 comment</SelectItem>
                      <SelectItem value="2">2 comments</SelectItem>
                      <SelectItem value="3">3 comments</SelectItem>
                      <SelectItem value="5">5 comments</SelectItem>
                      <SelectItem value="10">10 comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleCreatePost}
                  disabled={isCreating || !selectedProfile || !postTitle || !postContent}
                  className="w-full bg-burgundy-600 hover:bg-burgundy-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Post...
                    </>
                  ) : createSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Post Created!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview & Templates */}
            <div className="space-y-6">
              {/* Selected Profile Preview */}
              {selectedProfile && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Selected Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const profile = fakeProfiles.find((p) => p.id === selectedProfile);
                      if (!profile) return null;
                      return (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={profile.avatar || undefined} />
                            <AvatarFallback>
                              {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {profile.firstName} {profile.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                              {profile.email}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Quick Title Templates */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Quick Title Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {postCategory === "wins" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("Just signed my first paying client!")}
                      >
                        First client
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("Hit $5K month - never thought I'd be here!")}
                      >
                        $5K month
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("Client success story that made me cry!")}
                      >
                        Client success
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("Quit my 9-5 - officially full-time FM practitioner!")}
                      >
                        Quit job
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("I DID IT! Officially Certified! 🎓")}
                      >
                        Certified
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("From nurse to FM Practitioner - my journey")}
                      >
                        Nurse journey
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("Passed my certification exam! Here's my story...")}
                      >
                        Passed exam
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setPostTitle("6 months ago I started this journey... today I graduated!")}
                      >
                        Journey complete
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Add to Existing Post Tab */}
        <TabsContent value="existing" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Post Selection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Add Comments & Interactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filter by Topic */}
                <div className="space-y-2">
                  <Label className="font-semibold">1. Select Topic</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      variant={filterCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("all")}
                      className={filterCategory === "all" ? "bg-gray-800" : ""}
                    >
                      All ({recentPosts.length})
                    </Button>
                    <Button
                      variant={filterCategory === "coaching-tips" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("coaching-tips")}
                      className={filterCategory === "coaching-tips" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Tips ({recentPosts.filter(p => p.categoryId === "coaching-tips").length})
                    </Button>
                    <Button
                      variant={filterCategory === "questions-everyone-has" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("questions-everyone-has")}
                      className={filterCategory === "questions-everyone-has" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Questions ({recentPosts.filter(p => p.categoryId === "questions-everyone-has").length})
                    </Button>
                    <Button
                      variant={filterCategory === "career-pathway" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("career-pathway")}
                      className={filterCategory === "career-pathway" ? "bg-purple-600 hover:bg-purple-700" : ""}
                    >
                      <ChevronRight className="w-3 h-3 mr-1" />
                      Career ({recentPosts.filter(p => p.categoryId === "career-pathway").length})
                    </Button>
                    <Button
                      variant={filterCategory === "wins" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("wins")}
                      className={filterCategory === "wins" ? "bg-amber-600 hover:bg-amber-700" : ""}
                    >
                      <Trophy className="w-3 h-3 mr-1" />
                      Wins ({recentPosts.filter(p => p.categoryId === "wins").length})
                    </Button>
                    <Button
                      variant={filterCategory === "graduates" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("graduates")}
                      className={filterCategory === "graduates" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Grads ({recentPosts.filter(p => p.categoryId === "graduates").length})
                    </Button>
                    <Button
                      variant={filterCategory === "introductions" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("introductions")}
                      className={filterCategory === "introductions" ? "bg-pink-600 hover:bg-pink-700" : ""}
                    >
                      Intros ({recentPosts.filter(p => p.categoryId === "introductions").length})
                    </Button>
                  </div>
                </div>

                {/* Search Posts */}
                <div className="space-y-2">
                  <Label>2. Search Posts (optional)</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={postSearchQuery}
                      onChange={(e) => setPostSearchQuery(e.target.value)}
                      placeholder="Search by title or author..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Posts List */}
                <div className="space-y-2">
                  <Label>3. Select Post ({filteredPosts.length} found)</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-2 bg-white">
                    {filteredPosts.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No posts found in this category</p>
                    ) : (
                      filteredPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => {
                            setSelectedPostId(post.id);
                            setSetExactLikes(""); // Reset exact likes when selecting new post
                            // Initialize edit reactions with current post's reactions
                            setEditReactions((post.reactions as Record<string, number>) || {});
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedPostId === post.id
                              ? "border-burgundy-500 bg-burgundy-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{post.title}</p>
                              <p className="text-xs text-gray-500">
                                by {post.author.firstName} {post.author.lastName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getCategoryBadge(post.categoryId)}
                              {selectedPostId === post.id && (
                                <Check className="w-4 h-4 text-burgundy-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {post._count.comments}
                            </span>
                            {/* Show reactions breakdown */}
                            {post.reactions && (
                              <span className="flex items-center gap-1 flex-wrap">
                                {Object.entries(post.reactions as Record<string, number>).slice(0, 4).map(([emoji, count]) => (
                                  <span key={emoji} className="inline-flex items-center gap-0.5 text-[10px]">
                                    {emoji}{count}
                                  </span>
                                ))}
                              </span>
                            )}
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1 text-red-500 font-medium">
                              Total: <strong>{post.likeCount}</strong>
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Add Interactions Form */}
                {selectedPostId && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add to: {selectedPost?.title}
                    </h4>

                    {/* Comment Type */}
                    <div className="space-y-2">
                      <Label>Comment Type</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={addCommentType === "sarah" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAddCommentType("sarah")}
                          className={addCommentType === "sarah" ? "bg-amber-500 hover:bg-amber-600" : ""}
                        >
                          <Avatar className="h-4 w-4 mr-1">
                            <AvatarImage src="/coaches/sarah-coach.webp" />
                            <AvatarFallback>SM</AvatarFallback>
                          </Avatar>
                          Sarah
                        </Button>
                        <Button
                          variant={addCommentType === "member" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAddCommentType("member")}
                          className={addCommentType === "member" ? "bg-blue-500 hover:bg-blue-600" : ""}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Random Member
                        </Button>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="space-y-2">
                      <Label>Comment Content</Label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {(addCommentType === "sarah" ? SARAH_COMMENT_TEMPLATES : MEMBER_COMMENT_TEMPLATES)
                          .slice(0, 4)
                          .map((template, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                const name = selectedPost?.author.firstName || "there";
                                setExistingPostComment(template.replace("{name}", name));
                              }}
                            >
                              Template {idx + 1}
                            </Button>
                          ))}
                      </div>
                      <Textarea
                        value={existingPostComment}
                        onChange={(e) => setExistingPostComment(e.target.value)}
                        placeholder="Enter comment content..."
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Edit Individual Reactions */}
                    <div className="space-y-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                      <Label className="flex items-center gap-2 font-semibold text-amber-800">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Edit Reactions (Synced Everywhere)
                      </Label>

                      {/* Reaction editors grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {REACTION_EMOJIS.map((emoji) => (
                          <div key={emoji} className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-gray-200">
                            <span className="text-xl">{emoji}</span>
                            <Input
                              type="number"
                              value={editReactions[emoji] || 0}
                              onChange={(e) => setEditReactions(prev => ({
                                ...prev,
                                [emoji]: parseInt(e.target.value) || 0
                              }))}
                              min="0"
                              className="w-16 h-7 text-center text-sm font-medium"
                            />
                          </div>
                        ))}
                        {/* Additional emojis */}
                        {["💯", "🙌"].map((emoji) => (
                          <div key={emoji} className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-gray-200">
                            <span className="text-xl">{emoji}</span>
                            <Input
                              type="number"
                              value={editReactions[emoji] || 0}
                              onChange={(e) => setEditReactions(prev => ({
                                ...prev,
                                [emoji]: parseInt(e.target.value) || 0
                              }))}
                              min="0"
                              className="w-16 h-7 text-center text-sm font-medium"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Quick add +10 to all */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-white"
                          onClick={() => {
                            const updated: Record<string, number> = { ...editReactions };
                            [...REACTION_EMOJIS, "💯", "🙌"].forEach(emoji => {
                              updated[emoji] = (updated[emoji] || 0) + 10;
                            });
                            setEditReactions(updated);
                          }}
                        >
                          +10 All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-white"
                          onClick={() => {
                            const updated: Record<string, number> = { ...editReactions };
                            [...REACTION_EMOJIS, "💯", "🙌"].forEach(emoji => {
                              updated[emoji] = (updated[emoji] || 0) + 25;
                            });
                            setEditReactions(updated);
                          }}
                        >
                          +25 All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-white"
                          onClick={() => {
                            const updated: Record<string, number> = { ...editReactions };
                            [...REACTION_EMOJIS, "💯", "🙌"].forEach(emoji => {
                              updated[emoji] = (updated[emoji] || 0) + 50;
                            });
                            setEditReactions(updated);
                          }}
                        >
                          +50 All
                        </Button>
                      </div>

                      {/* Total display */}
                      <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                        <span className="text-xs text-gray-600">
                          Current Total: <strong className="text-red-600">{selectedPost?.likeCount || 0}</strong>
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          New Total: <strong>{Object.values(editReactions).reduce((sum, val) => sum + (val || 0), 0)}</strong>
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-700">These values sync to Post Card + Post Detail + Admin Panel</p>
                    </div>

                    {/* Submit */}
                    <Button
                      onClick={handleAddToExistingPost}
                      disabled={isAddingToPost}
                      className="w-full bg-burgundy-600 hover:bg-burgundy-700"
                    >
                      {isAddingToPost ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : addSuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Added Successfully!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Post
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Post Preview */}
            <div className="space-y-6">
              {selectedPost && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Selected Post</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      {getCategoryBadge(selectedPost.categoryId)}
                      <span className="text-xs text-gray-500">
                        {new Date(selectedPost.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-medium">{selectedPost.title}</h3>
                    <p className="text-sm text-gray-600">
                      by {selectedPost.author.firstName} {selectedPost.author.lastName}
                    </p>
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <span className="flex items-center gap-1 text-sm">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        {selectedPost._count.comments} comments
                      </span>
                      <span className="flex items-center gap-1 text-sm text-red-600">
                        <Heart className="w-4 h-4" />
                        <strong>{selectedPost.likeCount}</strong> likes
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(`/community/${selectedPost.id}`, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Post
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Current Reactions Preview */}
              {selectedPost && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Reactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedPost.reactions ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedPost.reactions as Record<string, number>).map(([emoji, count]) => (
                          <div key={emoji} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-lg">{emoji}</span>
                            <span className="font-bold text-sm">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 text-sm">No reactions yet</p>
                    )}
                    <div className="text-center text-xs text-gray-500 pt-2 border-t">
                      Total: <strong className="text-red-600">{selectedPost.likeCount}</strong>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
