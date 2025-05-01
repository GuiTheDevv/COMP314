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
                    sh "docker run -d --name test-container-${DOCKER_TAG} -p 8080:80 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "sleep 5"
                    sh "curl -s http://localhost:8080 | grep -q 'My Website'"
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