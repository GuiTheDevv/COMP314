pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'simple-webpage'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        DOCKER_HUB_REPO = 'guilherme123012/comp314' // Replace with your Docker Hub username
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Test Image') {
            steps {
                script {
                    // Find a free port to use for testing
                    def testPort = sh(script: """
                        for port in {8081..8100}; do
                            if ! netstat -tuln | grep -q ":$port "; then
                                echo \$port
                                break
                            fi
                        done
                    """, returnStdout: true).trim()
                    
                    echo "Using port ${testPort} for test container"
                    
                    // Run the container with the available port
                    sh "docker run -d --name test-container-${DOCKER_TAG} -p ${testPort}:80 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "sleep 5"
                    sh "curl -s http://localhost:${testPort} | grep -q 'My Website'"
                    sh "docker stop test-container-${DOCKER_TAG}"
                    sh "docker rm test-container-${DOCKER_TAG}"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
                    }
                    
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_HUB_REPO}:${DOCKER_TAG}"
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_HUB_REPO}:latest"
                    sh "docker push ${DOCKER_HUB_REPO}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO}:latest"
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh "docker stop simple-webpage-container || true"
                    sh "docker rm simple-webpage-container || true"
                    sh "docker run -d --name simple-webpage-container -p 80:80 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }
    
    post {
        always {
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            cleanWs()
        }
    }
}