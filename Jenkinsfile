pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'simple-webpage'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        DOCKER_HUB_REPO = 'guilherme123012/comp314' 
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
                    // Stop any previous test container if it exists
                    sh "docker stop test-container-${DOCKER_TAG} || true"
                    sh "docker rm test-container-${DOCKER_TAG} || true"
                    
                    // Run the container with a unique port based on build number
                    sh "docker run -d --name test-container-${DOCKER_TAG} -p ${TEST_PORT}:80 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "sleep 5"
                    
                    // Test if page is accessible
                    sh "curl -s http://localhost:${TEST_PORT} | grep -q 'My Website'"
                    
                    // Clean up after test
                    sh "docker stop test-container-${DOCKER_TAG}"
                    sh "docker rm test-container-${DOCKER_TAG}"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            // Removed the branch condition to ensure this stage always runs
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
            // Removed the branch condition to ensure this stage always runs
            steps {
                script {
                    // Stop and remove existing production container if it exists
                    sh "docker stop simple-webpage-container || true"
                    sh "docker rm simple-webpage-container || true"
                    
                    // Run new production container
                    sh "docker run -d --name simple-webpage-container -p 80:80 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }
    
    post {
        always {
            // Make sure test container is stopped and removed
            sh "docker stop test-container-${DOCKER_TAG} || true" 
            sh "docker rm test-container-${DOCKER_TAG} || true"
            
            // Clean up images
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            
            cleanWs()
        }
    }
}