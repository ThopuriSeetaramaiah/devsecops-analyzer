// AI-Powered Dynamic Question Generation
const OpenAI = require('openai');

class AIQuestionGenerator {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'your-api-key'
        });
    }

    async generateQuestions(userProfile, weakAreas, difficulty = 'intermediate') {
        const prompt = `Generate 5 DevSecOps questions for a ${userProfile.experience} level professional.
        
        Focus on weak areas: ${weakAreas.join(', ')}
        Difficulty: ${difficulty}
        Job role: ${userProfile.jobTitle}
        
        Include latest 2024-2025 technologies:
        - Kubernetes 1.28+
        - AWS Security services
        - GitOps practices
        - Container security
        - Zero-trust architecture
        
        Format as JSON array with: question, options (4 choices), correct_answer_index, explanation, technology_focus, difficulty_level`;

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 2000
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('AI Question Generation failed:', error);
            return this.getFallbackQuestions(weakAreas);
        }
    }

    async generateTrendingQuestions() {
        const prompt = `Generate 10 cutting-edge DevSecOps questions based on latest industry trends (2024-2025):
        
        Include topics:
        - AI/ML Security in DevOps
        - Quantum-safe cryptography
        - Supply chain security
        - Platform engineering
        - FinOps practices
        - Green computing in DevOps
        
        Make questions practical and job-interview ready.`;

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 3000
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            return this.getTrendingFallback();
        }
    }

    getFallbackQuestions(weakAreas) {
        return [
            {
                question: "What is the latest Kubernetes security best practice for 2024?",
                options: ["Pod Security Standards", "Network Policies", "RBAC", "All of the above"],
                correct_answer_index: 3,
                explanation: "Modern Kubernetes security requires a layered approach including all these elements.",
                technology_focus: "Kubernetes",
                difficulty_level: "intermediate"
            }
        ];
    }

    getTrendingFallback() {
        return [
            {
                question: "Which AI/ML security practice is most critical in DevSecOps pipelines?",
                options: ["Model versioning", "Data poisoning detection", "Inference monitoring", "All of the above"],
                correct_answer_index: 3,
                explanation: "AI/ML security requires comprehensive monitoring across all stages.",
                technology_focus: "AI Security",
                difficulty_level: "advanced"
            }
        ];
    }
}

module.exports = AIQuestionGenerator;
