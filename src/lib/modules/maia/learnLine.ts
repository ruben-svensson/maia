export type LearnLineId = string; // Unique identifier for each learn line

// Type for translations provided by a LearnLine
export type LearnLineTranslations = {
    [lang: string]: {
        title: string;
        description?: string;
        example?: string;
        // Any other translatable fields
    }
};

export type LearnLineContentBase = {
    id: string; // Unique identifier for the content
    contentType: 'text' | 'image' | 'video'; // Type of content
    nextAction?: 'autoProceed' | 'continueButton'; // How to proceed after this content
}

export type TextContent = LearnLineContentBase & {
    contentType: 'text';
    text: string; // The actual text content
}

export type ImageContent = LearnLineContentBase & {
    contentType: 'image';
    url: string; // Path to the image file
}

// Defines a math problem instance or template
export type MathProblemContent = LearnLineContentBase & {
    contentType: 'mathProblem';
    problem: string; // The problem statement, can include LaTeX or other formatting
}

interface VisualizationContent extends LearnLineContentBase {
    contentType: 'visualization';
    config: VisualizationConfig; // The object passed to the viz library
}

export type LearnLineContent = TextContent | ImageContent | VisualizationContent; // Union type for content types

interface AssessmentBase {
    id: string; // Unique identifier for the assessment
    assessmentType: 'problemSet'; // Type of assessment
}

/*interface QuizAssessment extends AssessmentBase {
    assessmentType: 'quiz';
    quizConfig: QuizConfig; // Configuration for the quiz module
    passingScore?: number; // Optional: score needed to pass this assessment
}*/

interface ProblemSetAssessment extends AssessmentBase {
    assessmentType: 'problemSet';
    problems: MathProblemContent[]; // A set of problems to solve
    minCorrect?: number; // Optional: number needed correct to pass
}

type LearnLineAssessment =  ProblemSetAssessment; // Currently only problem set assessments are supported

export type LearnLineStep = {
    id: string; // Unique identifier for the step
    title?: string; // Title of the step

    content: LearnLineContent[]; // Content of the step, can be a string or an array of strings

    assessment?: LearnLineAssessment; // Optional assessment for the step

}

export type LearnLine = {
    id: LearnLineId; // Unique identifier for the line
    title: string; // Default/fallback name of the line
    description?: string; // Default/fallback description
    example?: string; // Default/fallback example equation or concept

    prerequisites?: LearnLineId[]; // IDs of prerequisite lines
    tags?: string[]; // Tags for categorization

    steps: LearnLineStep[]; // Steps in the learn line

    finalAssessment?: LearnLineAssessment; // Optional final assessment for the learn line
    
    // Optional function to provide translations for this specific learn line
    i18n?: () => LearnLineTranslations;
};