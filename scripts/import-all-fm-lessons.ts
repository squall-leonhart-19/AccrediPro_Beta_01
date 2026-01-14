/**
 * Import All FM Lessons - Updates database with unified CSS content
 *
 * Usage: npx tsx scripts/import-all-fm-lessons.ts
 */

import { prisma } from "../src/lib/prisma";
import { LessonType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const FM_PATH = path.join(process.cwd(), "FM/FM-Update");

// Module definitions with correct lesson filenames
const moduleDefinitions: Record<string, {
  searchTerms: string[];
  lessons: { filename: string; title: string; description: string; order: number }[];
}> = {
  "Module_00": {
    searchTerms: ["Module 0", "Getting Started", "Orientation", "Welcome"],
    lessons: [
      { filename: "Lesson_0.1_Welcome_To_Your_Certification_Journey.html", title: "Welcome to Your Certification Journey", description: "Begin your transformation into a certified Functional Medicine Health Coach.", order: 1 },
      { filename: "Lesson_0.2_How_This_Program_Works.html", title: "How This Program Works", description: "Understand the program structure, expectations, and path to certification.", order: 2 },
      { filename: "Lesson_0.3_Setting_Up_For_Success.html", title: "Setting Up for Success", description: "Create your optimal learning environment and establish success habits.", order: 3 },
      { filename: "Lesson_0.4_Your_Learning_Roadmap_And_Community.html", title: "Your Learning Roadmap & Community", description: "Navigate the curriculum and connect with your learning community.", order: 4 },
    ]
  },
  "Module_01": {
    searchTerms: ["Foundations", "Module 1"],
    lessons: [
      { filename: "Lesson_1.1_Introduction_To_Functional_Medicine.html", title: "Introduction to Functional Medicine", description: "Discover the foundations of functional medicine, its history, core principles, and why this paradigm is essential for chronic health conditions.", order: 1 },
      { filename: "Lesson_1.2_What_Is_Functional_Medicine_Why_It_Matters.html", title: "What Is Functional Medicine & Why It Matters", description: "Deep dive into functional medicine's core principles, the 5 IFM principles, and how this approach creates lasting health transformation.", order: 2 },
      { filename: "Lesson_1.3_Systems_Biology_Root_Cause_Thinking.html", title: "Systems Biology & Root Cause Thinking", description: "Learn to see the body as an interconnected web, understand the seven core systems, and master upstream thinking with the 5 Whys technique.", order: 3 },
      { filename: "Lesson_1.4_The_Functional_Medicine_Timeline.html", title: "The Functional Medicine Timeline", description: "Master your first investigative tool: building a chronological timeline to reveal patterns. Learn the ATM framework (Antecedents, Triggers, Mediators).", order: 4 },
      { filename: "Lesson_1.5_The_Functional_Medicine_Matrix.html", title: "The Functional Medicine Matrix", description: "Understand how to organize clinical thinking using the FM Matrix. Learn to connect modifiable lifestyle factors to physiological systems.", order: 5 },
      { filename: "Lesson_1.6_The_Power_of_the_Patient_Story.html", title: "The Power of the Patient Story", description: "Learn why the patient's story is the most powerful diagnostic tool. Develop deep listening skills and understand the therapeutic value of being heard.", order: 6 },
      { filename: "Lesson_1.7_Conventional_Vs_Functional_Approach.html", title: "Conventional vs. Functional Approach", description: "Compare the two paradigms, understand when each excels, and learn to integrate both approaches for optimal client outcomes.", order: 7 },
      { filename: "Lesson_1.8_Case_Studies_Seeing_The_Whole_Picture.html", title: "Case Studies: Seeing the Whole Picture", description: "Apply everything you've learned to real-world case studies. Practice using the timeline, matrix, and systems thinking in complex scenarios.", order: 8 },
    ]
  },
  "Module_05": {
    searchTerms: ["Functional Nutrition", "Module 5", "Nutrition"],
    lessons: [
      { filename: "Lesson_5.1_Introduction_To_Functional_Nutrition.html", title: "Introduction to Functional Nutrition", description: "Discover how food is information that communicates with your genes, hormones, and cellular processes.", order: 1 },
      { filename: "Lesson_5.2_Macronutrients_Demystified.html", title: "Macronutrients Demystified", description: "Understand proteins, fats, and carbohydrates—what they do, how much you need, and how to balance them.", order: 2 },
      { filename: "Lesson_5.3_Blood_Sugar_Balance_And_Metabolic_Health.html", title: "Blood Sugar Balance & Metabolic Health", description: "Master the glucose-insulin connection and learn strategies for optimal blood sugar regulation.", order: 3 },
      { filename: "Lesson_5.4_Anti_Inflammatory_Eating.html", title: "Anti-Inflammatory Eating", description: "Learn which foods fuel inflammation and which ones fight it, plus practical anti-inflammatory strategies.", order: 4 },
      { filename: "Lesson_5.5_Food_Sensitivities_And_Elimination_Diets.html", title: "Food Sensitivities & Elimination Diets", description: "Understand food reactions and master the elimination diet protocol for identifying triggers.", order: 5 },
      { filename: "Lesson_5.6_Therapeutic_Diets_In_Functional_Medicine.html", title: "Therapeutic Diets in Functional Medicine", description: "Explore Mediterranean, Paleo, Keto, AIP, and Low-FODMAP diets and when to use each.", order: 6 },
      { filename: "Lesson_5.7_Practical_Nutrition_Coaching_Strategies.html", title: "Practical Nutrition Coaching Strategies", description: "Bridge the gap between knowing and doing with effective behavior change techniques.", order: 7 },
      { filename: "Lesson_5.8_Case_Studies_Nutrition_In_Action.html", title: "Case Studies: Nutrition in Action", description: "Apply functional nutrition principles to real-world client scenarios.", order: 8 },
    ]
  },
  "Module_06": {
    searchTerms: ["Gut Health", "Module 6", "Microbiome", "Digestive"],
    lessons: [
      { filename: "Lesson_6.1_Introduction_To_Gut_Health.html", title: "Introduction to Gut Health", description: "Understand why gut health is the foundation of overall wellness and the gateway to functional medicine.", order: 1 },
      { filename: "Lesson_6.2_The_Microbiome_Your_Inner_Ecosystem.html", title: "The Microbiome: Your Inner Ecosystem", description: "Explore the trillions of microorganisms that influence digestion, immunity, mood, and metabolism.", order: 2 },
      { filename: "Lesson_6.3_The_5R_Protocol_For_Gut_Restoration.html", title: "The 5R Protocol for Gut Restoration", description: "Master the Remove, Replace, Reinoculate, Repair, Rebalance framework for gut healing.", order: 3 },
      { filename: "Lesson_6.4_Leaky_Gut_Intestinal_Permeability.html", title: "Leaky Gut & Intestinal Permeability", description: "Understand the causes, symptoms, and functional approach to healing intestinal permeability.", order: 4 },
      { filename: "Lesson_6.5_SIBO_And_Digestive_Dysfunction.html", title: "SIBO & Digestive Dysfunction", description: "Learn about small intestinal bacterial overgrowth and other common digestive disorders.", order: 5 },
      { filename: "Lesson_6.6_Supporting_Digestion_Naturally.html", title: "Supporting Digestion Naturally", description: "Discover lifestyle, dietary, and supplement strategies to optimize digestive function.", order: 6 },
      { filename: "Lesson_6.7_The_Gut_Brain_Connection.html", title: "The Gut-Brain Connection", description: "Explore the bidirectional communication between gut and brain and its impact on mental health.", order: 7 },
      { filename: "Lesson_6.8_Case_Studies_Gut_Healing_In_Action.html", title: "Case Studies: Gut Healing in Action", description: "Apply gut health principles to real-world client scenarios and develop treatment strategies.", order: 8 },
    ]
  },
  "Module_02": {
    searchTerms: ["Health Coaching", "Module 2", "Coaching"],
    lessons: [
      { filename: "Lesson_2.1_Introduction_To_Health_Coaching.html", title: "Introduction to Health Coaching", description: "Discover the art and science of health coaching and its role in functional medicine.", order: 1 },
      { filename: "Lesson_2.2_Building_Trust_And_Rapport.html", title: "Building Trust and Rapport", description: "Master the foundational skills for creating meaningful client relationships.", order: 2 },
      { filename: "Lesson_2.3_Active_Listening_And_Presence.html", title: "Active Listening and Presence", description: "Develop deep listening skills that transform client conversations.", order: 3 },
      { filename: "Lesson_2.4_The_Art_Of_Powerful_Questions.html", title: "The Art of Powerful Questions", description: "Learn to ask questions that unlock client insights and motivation.", order: 4 },
      { filename: "Lesson_2.5_Motivational_Interviewing_And_OARS.html", title: "Motivational Interviewing and OARS", description: "Master the evidence-based approach to supporting behavior change.", order: 5 },
      { filename: "Lesson_2.6_Stages_Of_Change_And_Behavior_Science.html", title: "Stages of Change and Behavior Science", description: "Understand the psychology of change and how to meet clients where they are.", order: 6 },
      { filename: "Lesson_2.7_Goal_Setting_And_Action_Planning.html", title: "Goal Setting and Action Planning", description: "Create effective, achievable goals that drive lasting transformation.", order: 7 },
      { filename: "Lesson_2.8_Case_Studies_Coaching_In_Action.html", title: "Case Studies: Coaching in Action", description: "Apply coaching skills to real-world client scenarios.", order: 8 },
    ]
  },
  "Module_03": {
    searchTerms: ["Clinical Assessment", "Module 3", "Assessment", "Intake"],
    lessons: [
      { filename: "Lesson_3.1_Introduction_To_Clinical_Assessment.html", title: "Introduction to Clinical Assessment", description: "Learn the foundations of comprehensive client assessment in functional medicine.", order: 1 },
      { filename: "Lesson_3.2_Conducting_A_Comprehensive_Health_History.html", title: "Conducting a Comprehensive Health History", description: "Master the art of gathering detailed health histories that reveal root causes.", order: 2 },
      { filename: "Lesson_3.3_Building_The_Functional_Medicine_Timeline.html", title: "Building the Functional Medicine Timeline", description: "Create powerful timelines that connect health events to current symptoms.", order: 3 },
      { filename: "Lesson_3.4_Symptom_Clustering_And_Pattern_Recognition.html", title: "Symptom Clustering and Pattern Recognition", description: "Develop skills to identify patterns and connections in client symptoms.", order: 4 },
      { filename: "Lesson_3.5_Red_Flags_When_To_Refer.html", title: "Red Flags: When to Refer", description: "Recognize warning signs that require medical referral.", order: 5 },
      { filename: "Lesson_3.6_Structuring_Your_First_Session.html", title: "Structuring Your First Session", description: "Design effective initial consultations that set the foundation for success.", order: 6 },
      { filename: "Lesson_3.7_Documentation_And_Follow_Up_Systems.html", title: "Documentation and Follow-Up Systems", description: "Create professional documentation and tracking systems.", order: 7 },
      { filename: "Lesson_3.8_Case_Studies_Intake_Mastery.html", title: "Case Studies: Intake Mastery", description: "Apply assessment skills to complex client scenarios.", order: 8 },
    ]
  },
  "Module_04": {
    searchTerms: ["Professional Practice", "Module 4", "Ethics", "Legal", "Scope"],
    lessons: [
      { filename: "Lesson_4.1_Introduction_To_Professional_Practice.html", title: "Introduction to Professional Practice", description: "Understand the professional landscape of health coaching.", order: 1 },
      { filename: "Lesson_4.2_Understanding_Your_Scope_Of_Practice.html", title: "Understanding Your Scope of Practice", description: "Navigate the boundaries of health coaching with confidence.", order: 2 },
      { filename: "Lesson_4.3_Legal_Considerations_For_Health_Coaches.html", title: "Legal Considerations for Health Coaches", description: "Protect yourself and your clients with proper legal frameworks.", order: 3 },
      { filename: "Lesson_4.4_Ethical_Guidelines_And_Boundaries.html", title: "Ethical Guidelines and Boundaries", description: "Maintain professional boundaries and ethical standards.", order: 4 },
      { filename: "Lesson_4.5_Working_With_Healthcare_Providers.html", title: "Working with Healthcare Providers", description: "Build collaborative relationships with medical professionals.", order: 5 },
      { filename: "Lesson_4.6_Confidentiality_And_Client_Rights.html", title: "Confidentiality and Client Rights", description: "Protect client privacy and honor their rights.", order: 6 },
      { filename: "Lesson_4.7_Building_A_Referral_Network.html", title: "Building a Referral Network", description: "Create a network of trusted professionals for client support.", order: 7 },
      { filename: "Lesson_4.8_Case_Studies_Navigating_Ethical_Dilemmas.html", title: "Case Studies: Navigating Ethical Dilemmas", description: "Apply ethical decision-making to challenging scenarios.", order: 8 },
    ]
  },
  "Module_07": {
    searchTerms: ["Stress", "Module 7", "Adrenal", "HPA"],
    lessons: [
      { filename: "Lesson_7.1_Introduction_To_Stress_And_The_Stress_Response.html", title: "Introduction to Stress and the Stress Response", description: "Understand how stress impacts every system in the body.", order: 1 },
      { filename: "Lesson_7.2_The_HPA_Axis_And_Cortisol_Patterns.html", title: "The HPA Axis and Cortisol Patterns", description: "Explore the hypothalamic-pituitary-adrenal axis and stress hormones.", order: 2 },
      { filename: "Lesson_7.3_The_Autonomic_Nervous_System.html", title: "The Autonomic Nervous System", description: "Learn about sympathetic and parasympathetic balance.", order: 3 },
      { filename: "Lesson_7.4_Practical_Stress_Management_Strategies.html", title: "Practical Stress Management Strategies", description: "Discover evidence-based techniques for managing stress.", order: 4 },
      { filename: "Lesson_7.5_Adrenal_Support_And_HPA_Axis_Recovery.html", title: "Adrenal Support and HPA Axis Recovery", description: "Support adrenal health through lifestyle and nutrition.", order: 5 },
      { filename: "Lesson_7.6_The_Stress_Hormone_Connection.html", title: "The Stress-Hormone Connection", description: "Understand how stress affects other hormonal systems.", order: 6 },
      { filename: "Lesson_7.7_Building_Stress_Resilience_Over_Time.html", title: "Building Stress Resilience Over Time", description: "Develop long-term strategies for stress resilience.", order: 7 },
      { filename: "Lesson_7.8_Case_Studies_Stress_And_Adrenal_Health.html", title: "Case Studies: Stress and Adrenal Health", description: "Apply stress management principles to real scenarios.", order: 8 },
    ]
  },
  "Module_08": {
    searchTerms: ["Sleep", "Module 8", "Circadian"],
    lessons: [
      { filename: "Lesson_8.1_Introduction_To_Sleep_And_Circadian_Rhythms.html", title: "Introduction to Sleep and Circadian Rhythms", description: "Understand the science of sleep and its impact on health.", order: 1 },
      { filename: "Lesson_8.2_Common_Sleep_Disruptors.html", title: "Common Sleep Disruptors", description: "Identify factors that interfere with quality sleep.", order: 2 },
      { filename: "Lesson_8.3_Sleep_Hygiene_Foundations.html", title: "Sleep Hygiene Foundations", description: "Build the foundation for restorative sleep.", order: 3 },
      { filename: "Lesson_8.4_Nutritional_Support_For_Sleep.html", title: "Nutritional Support for Sleep", description: "Use nutrition to optimize sleep quality.", order: 4 },
      { filename: "Lesson_8.5_Sleep_And_Hormones.html", title: "Sleep and Hormones", description: "Explore the bidirectional relationship between sleep and hormones.", order: 5 },
      { filename: "Lesson_8.6_Cognitive_Behavioral_Strategies_For_Sleep.html", title: "Cognitive Behavioral Strategies for Sleep", description: "Apply CBT-I principles to improve sleep.", order: 6 },
      { filename: "Lesson_8.7_Special_Populations_And_Sleep_Challenges.html", title: "Special Populations and Sleep Challenges", description: "Address sleep issues in specific populations.", order: 7 },
      { filename: "Lesson_8.8_Case_Studies_Sleep_Transformation.html", title: "Case Studies: Sleep Transformation", description: "Apply sleep optimization strategies to real scenarios.", order: 8 },
    ]
  },
  "Module_09": {
    searchTerms: ["Female Hormones", "Module 9", "Women's Health", "Menstrual"],
    lessons: [
      { filename: "Lesson_9.1_Introduction_To_Female_Hormones.html", title: "Introduction to Female Hormones", description: "Understand the complex world of female hormonal health.", order: 1 },
      { filename: "Lesson_9.2_The_Menstrual_Cycle_Decoded.html", title: "The Menstrual Cycle Decoded", description: "Master the phases and hormones of the menstrual cycle.", order: 2 },
      { filename: "Lesson_9.3_Common_Hormonal_Imbalances.html", title: "Common Hormonal Imbalances", description: "Recognize and address common female hormone issues.", order: 3 },
      { filename: "Lesson_9.4_PMS_And_PMDD.html", title: "PMS and PMDD", description: "Support clients with premenstrual challenges.", order: 4 },
      { filename: "Lesson_9.5_PCOS_A_Functional_Medicine_Approach.html", title: "PCOS: A Functional Medicine Approach", description: "Address polycystic ovary syndrome holistically.", order: 5 },
      { filename: "Lesson_9.6_Supporting_Estrogen_Balance.html", title: "Supporting Estrogen Balance", description: "Optimize estrogen levels through lifestyle interventions.", order: 6 },
      { filename: "Lesson_9.7_Natural_Progesterone_Support.html", title: "Natural Progesterone Support", description: "Support healthy progesterone production naturally.", order: 7 },
      { filename: "Lesson_9.8_Case_Studies_Womens_Hormone_Health.html", title: "Case Studies: Women's Hormone Health", description: "Apply female hormone principles to real scenarios.", order: 8 },
    ]
  },
  "Module_10": {
    searchTerms: ["Perimenopause", "Module 10", "Menopause"],
    lessons: [
      { filename: "Lesson_10.1_Understanding_Perimenopause.html", title: "Understanding Perimenopause", description: "Navigate the transition into menopause with confidence.", order: 1 },
      { filename: "Lesson_10.2_The_Symptom_Spectrum_Of_Perimenopause.html", title: "The Symptom Spectrum of Perimenopause", description: "Recognize the diverse symptoms of perimenopause.", order: 2 },
      { filename: "Lesson_10.3_Lifestyle_Foundations_For_The_Menopausal_Transition.html", title: "Lifestyle Foundations for the Menopausal Transition", description: "Build a foundation for thriving through menopause.", order: 3 },
      { filename: "Lesson_10.4_Supplements_For_Perimenopausal_Support.html", title: "Supplements for Perimenopausal Support", description: "Evidence-based supplements for menopausal symptoms.", order: 4 },
      { filename: "Lesson_10.5_Understanding_Hormone_Therapy_Options.html", title: "Understanding Hormone Therapy Options", description: "Navigate hormone replacement therapy decisions.", order: 5 },
      { filename: "Lesson_10.6_Postmenopause_Thriving_In_The_Next_Chapter.html", title: "Postmenopause: Thriving in the Next Chapter", description: "Support optimal health after menopause.", order: 6 },
      { filename: "Lesson_10.7_Special_Considerations_In_Menopause.html", title: "Special Considerations in Menopause", description: "Address unique challenges in menopausal health.", order: 7 },
      { filename: "Lesson_10.8_Case_Studies_Menopause.html", title: "Case Studies: Menopause", description: "Apply menopausal support strategies to real scenarios.", order: 8 },
    ]
  },
  "Module_11": {
    searchTerms: ["Thyroid", "Module 11"],
    lessons: [
      { filename: "Lesson_11.1_Introduction_To_Thyroid_Function.html", title: "Introduction to Thyroid Function", description: "Understand the thyroid's role in metabolism and health.", order: 1 },
      { filename: "Lesson_11.2_Common_Thyroid_Disorders.html", title: "Common Thyroid Disorders", description: "Recognize hypothyroidism, hyperthyroidism, and Hashimoto's.", order: 2 },
      { filename: "Lesson_11.3_Thyroid_Testing_And_Interpretation.html", title: "Thyroid Testing and Interpretation", description: "Understand comprehensive thyroid testing.", order: 3 },
      { filename: "Lesson_11.4_Root_Causes_Of_Thyroid_Dysfunction.html", title: "Root Causes of Thyroid Dysfunction", description: "Identify underlying factors affecting thyroid health.", order: 4 },
      { filename: "Lesson_11.5_Nutrition_For_Thyroid_Health.html", title: "Nutrition for Thyroid Health", description: "Optimize thyroid function through diet.", order: 5 },
      { filename: "Lesson_11.6_Lifestyle_Strategies_For_Thyroid_Support.html", title: "Lifestyle Strategies for Thyroid Support", description: "Support thyroid health through lifestyle interventions.", order: 6 },
      { filename: "Lesson_11.7_Working_With_Thyroid_Medication.html", title: "Working with Thyroid Medication", description: "Understand thyroid medications and support clients on them.", order: 7 },
      { filename: "Lesson_11.8_Case_Studies_Thyroid_Health.html", title: "Case Studies: Thyroid Health", description: "Apply thyroid principles to real scenarios.", order: 8 },
    ]
  },
  "Module_12": {
    searchTerms: ["Metabolism", "Module 12", "Weight", "Blood Sugar"],
    lessons: [
      { filename: "Lesson_12.1_Understanding_Metabolism.html", title: "Understanding Metabolism", description: "Explore the science of energy production and expenditure.", order: 1 },
      { filename: "Lesson_12.2_Insulin_Resistance_And_Blood_Sugar_Regulation.html", title: "Insulin Resistance and Blood Sugar Regulation", description: "Master the glucose-insulin connection.", order: 2 },
      { filename: "Lesson_12.3_Root_Causes_Of_Weight_Gain.html", title: "Root Causes of Weight Gain", description: "Identify factors beyond calories that affect weight.", order: 3 },
      { filename: "Lesson_12.4_Sustainable_Approaches_To_Weight_Management.html", title: "Sustainable Approaches to Weight Management", description: "Create lasting weight management strategies.", order: 4 },
      { filename: "Lesson_12.5_Dietary_Approaches_For_Metabolic_Health.html", title: "Dietary Approaches for Metabolic Health", description: "Use nutrition to optimize metabolism.", order: 5 },
      { filename: "Lesson_12.6_Body_Composition_And_Movement.html", title: "Body Composition and Movement", description: "Support healthy body composition through exercise.", order: 6 },
      { filename: "Lesson_12.7_Medications_And_Supplements_For_Metabolic_Health.html", title: "Medications and Supplements for Metabolic Health", description: "Understand metabolic support options.", order: 7 },
      { filename: "Lesson_12.8_Case_Studies_Metabolic_Health.html", title: "Case Studies: Metabolic Health", description: "Apply metabolic principles to real scenarios.", order: 8 },
    ]
  },
  "Module_13": {
    searchTerms: ["Immune", "Module 13", "Autoimmune"],
    lessons: [
      { filename: "13.1_Understanding_The_Immune_System.html", title: "Understanding the Immune System", description: "Explore the foundations of immune function.", order: 1 },
      { filename: "13.2_Common_Autoimmune_Conditions.html", title: "Common Autoimmune Conditions", description: "Recognize major autoimmune diseases.", order: 2 },
      { filename: "13.3_Root_Causes_Of_Immune_Dysfunction.html", title: "Root Causes of Immune Dysfunction", description: "Identify triggers and contributors to immune issues.", order: 3 },
      { filename: "13.4_Anti_Inflammatory_Nutrition.html", title: "Anti-Inflammatory Nutrition", description: "Use diet to calm immune overactivation.", order: 4 },
      { filename: "13.5_Lifestyle_Strategies_For_Immune_Balance.html", title: "Lifestyle Strategies for Immune Balance", description: "Support immune health through lifestyle.", order: 5 },
      { filename: "13.6_Gut_Health_And_Autoimmunity.html", title: "Gut Health and Autoimmunity", description: "Understand the gut-immune connection.", order: 6 },
      { filename: "13.7_Supplements_For_Immune_Support.html", title: "Supplements for Immune Support", description: "Evidence-based immune support supplements.", order: 7 },
      { filename: "13.8_Case_Studies_Autoimmunity.html", title: "Case Studies: Autoimmunity", description: "Apply immune principles to real scenarios.", order: 8 },
    ]
  },
  "Module_14": {
    searchTerms: ["Brain", "Module 14", "Mental Health", "Cognitive"],
    lessons: [
      { filename: "Lesson_14.1_The_Brain_Body_Connection.html", title: "The Brain-Body Connection", description: "Understand the bidirectional brain-body relationship.", order: 1 },
      { filename: "Lesson_14.2_Neurotransmitters_And_Brain_Chemistry.html", title: "Neurotransmitters and Brain Chemistry", description: "Explore the molecules that affect mood and cognition.", order: 2 },
      { filename: "Lesson_14.3_Anxiety_And_Depression_Root_Causes.html", title: "Anxiety and Depression: Root Causes", description: "Identify underlying factors in mood disorders.", order: 3 },
      { filename: "Lesson_14.4_Cognitive_Function_And_Brain_Fog.html", title: "Cognitive Function and Brain Fog", description: "Address cognitive decline and brain fog.", order: 4 },
      { filename: "Lesson_14.5_Sleep_And_Mental_Health.html", title: "Sleep and Mental Health", description: "Understand the sleep-mood connection.", order: 5 },
      { filename: "Lesson_14.6_Nutrition_For_Brain_Health.html", title: "Nutrition for Brain Health", description: "Optimize brain function through diet.", order: 6 },
      { filename: "Lesson_14.7_Lifestyle_Medicine_For_Mental_Wellness.html", title: "Lifestyle Medicine for Mental Wellness", description: "Support mental health through lifestyle interventions.", order: 7 },
      { filename: "Lesson_14.8_Case_Studies_Mental_Health.html", title: "Case Studies: Mental Health", description: "Apply brain health principles to real scenarios.", order: 8 },
    ]
  },
  "Module_15": {
    searchTerms: ["Cardiovascular", "Module 15", "Heart", "Cardiometabolic"],
    lessons: [
      { filename: "Lesson_15.1_Understanding_Cardiovascular_Disease.html", title: "Understanding Cardiovascular Disease", description: "Explore the functional approach to heart health.", order: 1 },
      { filename: "Lesson_15.2_Blood_Pressure_And_Vascular_Health.html", title: "Blood Pressure and Vascular Health", description: "Address hypertension naturally.", order: 2 },
      { filename: "Lesson_15.3_Cholesterol_And_Lipids_Beyond_The_Basics.html", title: "Cholesterol and Lipids: Beyond the Basics", description: "Understand advanced lipid testing and management.", order: 3 },
      { filename: "Lesson_15.4_Blood_Sugar_And_Diabetes_Prevention.html", title: "Blood Sugar and Diabetes Prevention", description: "Prevent and manage metabolic syndrome.", order: 4 },
      { filename: "Lesson_15.5_Nutrition_For_Heart_Health.html", title: "Nutrition for Heart Health", description: "Optimize cardiovascular health through diet.", order: 5 },
      { filename: "Lesson_15.6_Exercise_And_Cardiovascular_Fitness.html", title: "Exercise and Cardiovascular Fitness", description: "Support heart health through movement.", order: 6 },
      { filename: "Lesson_15.7_Stress_Sleep_And_Heart_Health.html", title: "Stress, Sleep, and Heart Health", description: "Address lifestyle factors affecting the heart.", order: 7 },
      { filename: "Lesson_15.8_Case_Studies_Cardiometabolic_Health.html", title: "Case Studies: Cardiometabolic Health", description: "Apply heart health principles to real scenarios.", order: 8 },
    ]
  },
  "Module_16": {
    searchTerms: ["Energy", "Module 16", "Mitochondria", "Fatigue"],
    lessons: [
      { filename: "Lesson_16.1_Understanding_Cellular_Energy_Production.html", title: "Understanding Cellular Energy Production", description: "Explore how cells create energy.", order: 1 },
      { filename: "Lesson_16.2_The_Fatigue_Epidemic.html", title: "The Fatigue Epidemic", description: "Understand the root causes of chronic fatigue.", order: 2 },
      { filename: "Lesson_16.3_Nutrition_For_Optimal_Energy.html", title: "Nutrition for Optimal Energy", description: "Fuel your mitochondria through diet.", order: 3 },
      { filename: "Lesson_16.4_Exercise_And_Mitochondrial_Biogenesis.html", title: "Exercise and Mitochondrial Biogenesis", description: "Build more energy-producing mitochondria.", order: 4 },
      { filename: "Lesson_16.5_Sleep_And_Cellular_Restoration.html", title: "Sleep and Cellular Restoration", description: "Support cellular repair through sleep.", order: 5 },
      { filename: "Lesson_16.6_Stress_Cortisol_And_Energy_Depletion.html", title: "Stress, Cortisol, and Energy Depletion", description: "Address stress-related energy drain.", order: 6 },
      { filename: "Lesson_16.7_Supplements_For_Mitochondrial_Support.html", title: "Supplements for Mitochondrial Support", description: "Evidence-based energy supplements.", order: 7 },
      { filename: "Lesson_16.8_Case_Studies_Energy_And_Mitochondrial_Health.html", title: "Case Studies: Energy and Mitochondrial Health", description: "Apply energy principles to real scenarios.", order: 8 },
    ]
  },
  "Module_17": {
    searchTerms: ["Detox", "Module 17", "Toxins", "Environmental"],
    lessons: [
      { filename: "17.1_Understanding_Environmental_Toxins.html", title: "Understanding Environmental Toxins", description: "Identify common toxic exposures.", order: 1 },
      { filename: "17.2_The_Bodys_Detoxification_Systems.html", title: "The Body's Detoxification Systems", description: "Understand how the body eliminates toxins.", order: 2 },
      { filename: "17.3_Nutrition_For_Detoxification_Support.html", title: "Nutrition for Detoxification Support", description: "Support detox pathways through diet.", order: 3 },
      { filename: "17.4_Reducing_Toxic_Exposures_In_Daily_Life.html", title: "Reducing Toxic Exposures in Daily Life", description: "Minimize environmental toxin exposure.", order: 4 },
      { filename: "17.5_Lifestyle_Practices_That_Support_Detoxification.html", title: "Lifestyle Practices That Support Detoxification", description: "Enhance detox through lifestyle.", order: 5 },
      { filename: "17.6_Supplements_For_Detoxification_Support.html", title: "Supplements for Detoxification Support", description: "Evidence-based detox support supplements.", order: 6 },
      { filename: "17.7_Mold_Illness_And_Environmental_Sensitivity.html", title: "Mold Illness and Environmental Sensitivity", description: "Address mold and chemical sensitivities.", order: 7 },
      { filename: "17.8_Case_Studies_Detoxification.html", title: "Case Studies: Detoxification", description: "Apply detox principles to real scenarios.", order: 8 },
    ]
  },
  "Module_18": {
    searchTerms: ["Lab Testing", "Module 18", "Blood Work", "Interpretation"],
    lessons: [
      { filename: "Lesson_18.1_Introduction_To_Functional_Lab_Testing.html", title: "Introduction to Functional Lab Testing", description: "Understand the role of labs in functional medicine.", order: 1 },
      { filename: "Lesson_18.2_Blood_Chemistry_Basics.html", title: "Blood Chemistry Basics", description: "Interpret basic blood chemistry panels.", order: 2 },
      { filename: "Lesson_18_3_Complete_Blood_Count_Interpretation.html", title: "Complete Blood Count Interpretation", description: "Analyze CBC results functionally.", order: 3 },
      { filename: "Lesson_18_4_Thyroid_Testing.html", title: "Thyroid Testing", description: "Comprehensive thyroid panel interpretation.", order: 4 },
      { filename: "Lesson_18_5_Lipid_Panels_and_Cardiovascular_Markers.html", title: "Lipid Panels and Cardiovascular Markers", description: "Advanced lipid testing interpretation.", order: 5 },
      { filename: "Lesson_18_6_Hormone_Testing.html", title: "Hormone Testing", description: "Interpret hormone panels effectively.", order: 6 },
      { filename: "Lesson_18_7_Gut_and_Microbiome_Testing.html", title: "Gut and Microbiome Testing", description: "Understand stool and microbiome tests.", order: 7 },
      { filename: "Lesson_18_8_Case_Studies_in_Lab_Interpretation.html", title: "Case Studies in Lab Interpretation", description: "Apply lab interpretation to real scenarios.", order: 8 },
    ]
  },
  "Module_19": {
    searchTerms: ["Protocol", "Module 19", "Treatment Plan"],
    lessons: [
      { filename: "Lesson_19.1_Introduction_To_Protocol_Building.html", title: "Introduction to Protocol Building", description: "Learn to create comprehensive wellness protocols.", order: 1 },
      { filename: "Lesson_19.2_Client_Assessment_And_Goal_Setting.html", title: "Client Assessment and Goal Setting", description: "Set effective client goals.", order: 2 },
      { filename: "Lesson_19.3_Nutrition_Protocol_Design.html", title: "Nutrition Protocol Design", description: "Create personalized nutrition plans.", order: 3 },
      { filename: "Lesson_19.4_Lifestyle_Protocol_Design.html", title: "Lifestyle Protocol Design", description: "Design comprehensive lifestyle interventions.", order: 4 },
      { filename: "Lesson_19.5_Supplement_Guidance_Within_Scope.html", title: "Supplement Guidance Within Scope", description: "Provide appropriate supplement recommendations.", order: 5 },
      { filename: "Lesson_19.6_Program_Sequencing_And_Phasing.html", title: "Program Sequencing and Phasing", description: "Structure protocols for optimal results.", order: 6 },
      { filename: "Lesson_19.7_Tracking_Progress_And_Adjusting.html", title: "Tracking Progress and Adjusting", description: "Monitor and adapt client protocols.", order: 7 },
      { filename: "Lesson_19.8_Case_Studies_Protocol_Building.html", title: "Case Studies: Protocol Building", description: "Apply protocol design to real scenarios.", order: 8 },
    ]
  },
  "Module_20": {
    searchTerms: ["Practice Building", "Module 20", "Business"],
    lessons: [
      { filename: "Lesson_20.1_Introduction_To_Practice_Building.html", title: "Introduction to Practice Building", description: "Launch your health coaching business.", order: 1 },
      { filename: "Lesson_20.2_Defining_Your_Niche_And_Ideal_Client.html", title: "Defining Your Niche and Ideal Client", description: "Identify your target market.", order: 2 },
      { filename: "Lesson_20.3_Creating_Coaching_Packages_And_Pricing.html", title: "Creating Coaching Packages and Pricing", description: "Structure and price your services.", order: 3 },
      { filename: "Lesson_20.4_Marketing_Foundations_And_Client_Attraction.html", title: "Marketing Foundations and Client Attraction", description: "Attract clients to your practice.", order: 4 },
      { filename: "Lesson_20.5_Consultation_Process_And_Client_Enrollment.html", title: "Consultation Process and Client Enrollment", description: "Convert prospects into clients.", order: 5 },
      { filename: "Lesson_20.6_Practice_Systems_And_Operations.html", title: "Practice Systems and Operations", description: "Create efficient business systems.", order: 6 },
      { filename: "Lesson_20.7_Building_Referral_Networks.html", title: "Building Referral Networks", description: "Grow through professional referrals.", order: 7 },
      { filename: "Lesson_20.8_Sustainable_Growth_And_Practice_Evolution.html", title: "Sustainable Growth and Practice Evolution", description: "Scale your practice sustainably.", order: 8 },
    ]
  },
};

// Extract content with CSS from HTML file
function extractContentWithStyles(html: string): string {
  // Extract CSS from <style> tag
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  let cssContent = styleMatch ? styleMatch[1].trim() : '';

  // Remove body styles that conflict with parent page
  cssContent = cssContent.replace(/body\s*\{[^}]*\}/gi, '');

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Could not find body content in HTML");
  }

  let bodyContent = bodyMatch[1].trim();

  // Remove legacy elements
  bodyContent = bodyContent.replace(/<div class="brand-header"><\/div>/g, '');
  bodyContent = bodyContent.replace(/<div class="lesson-footer"><\/div>/g, '');

  // Combine CSS + HTML content
  const finalContent = `<style>${cssContent}</style>\n${bodyContent.trim()}`;

  return finalContent;
}

async function findModule(courseId: string, searchTerms: string[]): Promise<{ id: string; title: string; lessons: { id: string; order: number }[] } | null> {
  for (const term of searchTerms) {
    const module = await prisma.module.findFirst({
      where: {
        courseId,
        title: { contains: term }
      },
      include: {
        lessons: { select: { id: true, order: true } }
      }
    });
    if (module) return module;
  }
  return null;
}

async function main() {
  console.log("🚀 Starting FM Lessons Import (Unified CSS)\n");

  // Find the FM course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
    select: { id: true, title: true }
  });

  if (!course) {
    console.log("❌ FM Course not found!");
    return;
  }

  console.log(`✅ Found course: ${course.title}\n`);

  let totalUpdated = 0;
  let totalCreated = 0;

  for (const [moduleName, config] of Object.entries(moduleDefinitions)) {
    const modulePath = path.join(FM_PATH, moduleName);

    if (!fs.existsSync(modulePath)) {
      console.log(`⏭️  Skipping ${moduleName} (path not found)`);
      continue;
    }

    // Find module in database
    const module = await findModule(course.id, config.searchTerms);

    if (!module) {
      console.log(`⚠️  Module not found in DB for ${moduleName}, skipping...`);
      continue;
    }

    console.log(`📦 Processing ${moduleName} → "${module.title}"`);

    for (const lessonDef of config.lessons) {
      const filePath = path.join(modulePath, lessonDef.filename);

      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  File not found: ${lessonDef.filename}`);
        continue;
      }

      const htmlContent = fs.readFileSync(filePath, "utf-8");
      const lessonContent = extractContentWithStyles(htmlContent);

      // Find existing lesson by order
      const existingLesson = module.lessons.find(l => l.order === lessonDef.order);

      if (existingLesson) {
        await prisma.lesson.update({
          where: { id: existingLesson.id },
          data: {
            title: lessonDef.title,
            description: lessonDef.description,
            content: lessonContent,
          },
        });
        totalUpdated++;
        console.log(`   ✅ Updated: ${lessonDef.title}`);
      } else {
        await prisma.lesson.create({
          data: {
            title: lessonDef.title,
            description: lessonDef.description,
            content: lessonContent,
            order: lessonDef.order,
            lessonType: LessonType.TEXT,
            isPublished: true,
            isFreePreview: false,
            moduleId: module.id,
          },
        });
        totalCreated++;
        console.log(`   ✅ Created: ${lessonDef.title}`);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Summary: ${totalUpdated} updated, ${totalCreated} created`);
  console.log("✨ Import complete! Refresh your browser to see changes.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
