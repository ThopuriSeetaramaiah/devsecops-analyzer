// Real MCP Integration for Dynamic Question Generation
class RealMCPQuestionGenerator {
    constructor() {
        this.questionTemplates = this.initializeTemplates();
        this.usedCombinations = new Set();
    }

    initializeTemplates() {
        return {
            aws_services: {
                'EC2': {
                    concepts: ['instances', 'AMIs', 'security groups', 'key pairs', 'elastic IPs'],
                    use_cases: ['web hosting', 'batch processing', 'high-performance computing'],
                    features: ['auto scaling', 'load balancing', 'spot instances', 'reserved instances']
                },
                'S3': {
                    concepts: ['buckets', 'objects', 'storage classes', 'versioning', 'lifecycle policies'],
                    use_cases: ['data backup', 'static website hosting', 'data archiving', 'content distribution'],
                    features: ['encryption', 'access control', 'cross-region replication', 'event notifications']
                },
                'Lambda': {
                    concepts: ['functions', 'triggers', 'runtime', 'layers', 'environment variables'],
                    use_cases: ['API backends', 'data processing', 'scheduled tasks', 'event handling'],
                    features: ['auto scaling', 'pay-per-request', 'VPC integration', 'dead letter queues']
                },
                'RDS': {
                    concepts: ['instances', 'engines', 'parameter groups', 'option groups', 'snapshots'],
                    use_cases: ['web applications', 'data warehousing', 'analytics', 'backup solutions'],
                    features: ['multi-AZ', 'read replicas', 'automated backups', 'encryption']
                },
                'VPC': {
                    concepts: ['subnets', 'route tables', 'internet gateways', 'NAT gateways', 'VPC endpoints'],
                    use_cases: ['network isolation', 'hybrid connectivity', 'multi-tier applications'],
                    features: ['security groups', 'NACLs', 'flow logs', 'peering connections']
                }
            },
            question_patterns: {
                basic: [
                    "What is the primary purpose of {service} {concept}?",
                    "Which {service} feature is best for {use_case}?",
                    "How does {service} {feature} work?",
                    "What are the benefits of using {service} for {use_case}?"
                ],
                scenario: [
                    "A company needs to {use_case} using {service}. Which {feature} should they use?",
                    "You are designing a solution that requires {use_case}. How would you configure {service}?",
                    "What is the best practice for implementing {feature} in {service}?",
                    "How would you troubleshoot {concept} issues in {service}?"
                ],
                security: [
                    "What security feature of {service} helps protect {concept}?",
                    "How do you secure {service} {concept} in a production environment?",
                    "What are the security implications of {feature} in {service}?",
                    "Which {service} security practice prevents unauthorized access to {concept}?"
                ],
                advanced: [
                    "How do you optimize {service} performance for {use_case}?",
                    "What are the cost implications of using {service} {feature}?",
                    "How does {service} integrate with other AWS services for {use_case}?",
                    "What monitoring should be implemented for {service} {concept}?"
                ]
            },
            distractors: {
                services: ['CloudFront', 'Route 53', 'SQS', 'SNS', 'DynamoDB', 'ElastiCache'],
                generic_wrong: ['Manual configuration', 'Not recommended', 'Deprecated feature', 'Not supported'],
                security_wrong: ['Store in plain text', 'Disable encryption', 'Use default passwords', 'Allow all access']
            }
        };
    }

    generateDynamicQuestion(service, difficulty = 'intermediate') {
        const serviceData = this.questionTemplates.aws_services[service];
        if (!serviceData) return null;

        const patternType = this.selectPatternByDifficulty(difficulty);
        const pattern = this.getRandomElement(this.questionTemplates.question_patterns[patternType]);
        
        // Generate unique combination
        const concept = this.getRandomElement(serviceData.concepts);
        const useCase = this.getRandomElement(serviceData.use_cases);
        const feature = this.getRandomElement(serviceData.features);
        
        const combinationKey = `${service}-${patternType}-${concept}-${useCase}-${feature}`;
        
        // Skip if we've used this combination recently
        if (this.usedCombinations.has(combinationKey)) {
            return this.generateDynamicQuestion(service, difficulty); // Try again
        }
        
        this.usedCombinations.add(combinationKey);
        
        // Clean up old combinations (keep last 100)
        if (this.usedCombinations.size > 100) {
            const oldCombinations = Array.from(this.usedCombinations).slice(0, 50);
            oldCombinations.forEach(combo => this.usedCombinations.delete(combo));
        }

        // Generate question text
        const questionText = pattern
            .replace('{service}', service)
            .replace('{concept}', concept)
            .replace('{use_case}', useCase)
            .replace('{feature}', feature);

        // Generate options
        const correctAnswer = this.generateCorrectAnswer(service, concept, useCase, feature, patternType);
        const wrongAnswers = this.generateWrongAnswers(service, concept, useCase, feature, patternType);
        
        const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);
        const correctIndex = options.indexOf(correctAnswer);

        return {
            id: `dynamic-${service.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            question: questionText,
            options: options,
            correct: correctIndex,
            explanation: this.generateExplanation(service, concept, useCase, feature, correctAnswer),
            domain: this.mapServiceToDomain(service),
            difficulty: difficulty,
            source: `AWS ${service} Documentation - Dynamic Generation`,
            service: service,
            pattern_type: patternType,
            generated_at: new Date().toISOString()
        };
    }

    selectPatternByDifficulty(difficulty) {
        const patterns = {
            'beginner': ['basic'],
            'intermediate': ['basic', 'scenario', 'security'],
            'advanced': ['scenario', 'security', 'advanced']
        };
        
        const availablePatterns = patterns[difficulty] || patterns['intermediate'];
        return this.getRandomElement(availablePatterns);
    }

    generateCorrectAnswer(service, concept, useCase, feature, patternType) {
        const answerTemplates = {
            basic: [
                `${service} ${feature} provides ${concept} management`,
                `${feature} is the recommended approach for ${useCase}`,
                `${concept} in ${service} enables ${useCase}`,
                `${service} ${feature} optimizes ${concept} performance`
            ],
            scenario: [
                `Configure ${service} ${feature} with ${concept} settings`,
                `Use ${service} ${feature} for ${useCase} requirements`,
                `Implement ${concept} using ${service} ${feature}`,
                `Enable ${feature} to support ${useCase}`
            ],
            security: [
                `Enable ${service} encryption for ${concept}`,
                `Use IAM roles to secure ${service} ${concept}`,
                `Configure ${feature} with least privilege access`,
                `Implement ${service} security groups for ${concept}`
            ],
            advanced: [
                `Optimize ${service} ${feature} for cost and performance`,
                `Use ${service} monitoring and ${feature} for ${useCase}`,
                `Implement ${concept} with ${service} best practices`,
                `Configure ${feature} for high availability ${useCase}`
            ]
        };

        const templates = answerTemplates[patternType] || answerTemplates['basic'];
        return this.getRandomElement(templates);
    }

    generateWrongAnswers(service, concept, useCase, feature, patternType) {
        const wrongAnswers = [];
        
        // Add service-specific wrong answers
        const otherServices = this.questionTemplates.distractors.services.filter(s => s !== service);
        wrongAnswers.push(`Use ${this.getRandomElement(otherServices)} instead of ${service}`);
        
        // Add generic wrong answers
        wrongAnswers.push(this.getRandomElement(this.questionTemplates.distractors.generic_wrong));
        
        // Add security-specific wrong answers for security questions
        if (patternType === 'security') {
            wrongAnswers.push(this.getRandomElement(this.questionTemplates.distractors.security_wrong));
        } else {
            wrongAnswers.push(`Manually configure ${concept} without ${feature}`);
        }

        return wrongAnswers.slice(0, 3); // Return 3 wrong answers
    }

    generateExplanation(service, concept, useCase, feature, correctAnswer) {
        return `${correctAnswer}. This is because ${service} ${feature} is specifically designed to handle ${concept} for ${useCase} scenarios. AWS documentation recommends this approach for optimal performance and security.`;
    }

    mapServiceToDomain(service) {
        const domainMap = {
            'EC2': 'Compute',
            'S3': 'Storage', 
            'Lambda': 'Compute',
            'RDS': 'Database',
            'VPC': 'Networking'
        };
        return domainMap[service] || 'General';
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Generate multiple unique questions
    generateMultipleQuestions(services, count = 10, difficulty = 'mixed') {
        const questions = [];
        const servicesArray = Array.isArray(services) ? services : Object.keys(this.questionTemplates.aws_services);
        
        for (let i = 0; i < count; i++) {
            const service = this.getRandomElement(servicesArray);
            const questionDifficulty = difficulty === 'mixed' ? 
                this.getRandomElement(['beginner', 'intermediate', 'advanced']) : difficulty;
            
            const question = this.generateDynamicQuestion(service, questionDifficulty);
            if (question) {
                questions.push(question);
            }
        }
        
        return questions;
    }

    // Reset used combinations for fresh questions
    resetUsedCombinations() {
        this.usedCombinations.clear();
        console.log('Question combinations reset - fresh questions available');
    }
}

module.exports = RealMCPQuestionGenerator;
