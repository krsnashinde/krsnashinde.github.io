import React, { useState, useEffect } from "react";
import { Profile } from "@/entities/Profile";
import { Project } from "@/entities/Project";
import { Skill } from "@/entities/Skill";
import { Experience } from "@/entities/Experience";

import Navigation from "../components/portfolio/Navigation";
import HeroSection from "../components/portfolio/HeroSection";
import AboutSection from "../components/portfolio/AboutSection";
import SkillsSection from "../components/portfolio/SkillsSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import ExperienceSection from "../components/portfolio/ExperienceSection";
import ContactSection from "../components/portfolio/ContactSection";

export default function PortfolioPage() {
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPortfolioData();
    }, []);

    const loadPortfolioData = async () => {
        setIsLoading(true);
        try {
            const [profileData, projectsData, skillsData, experiencesData] = await Promise.all([
                Profile.list().catch(() => []),
                Project.list('-completion_date').catch(() => []),
                Skill.list('category').catch(() => []),
                Experience.list('-start_date').catch(() => [])
            ]);

            setProfile(profileData[0] || null);
            setProjects(projectsData);
            setSkills(skillsData);
            setExperiences(experiencesData);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
        setIsLoading(false);
    };

    const createSampleData = async () => {
        try {
            // Create sample profile
            await Profile.create({
                full_name: "Krishna Shinde",
                title: "Full Stack Developer",
                bio: "Passionate developer creating amazing digital experiences.",
                detailed_about: "I'm a developer with experience in modern web technologies. I love creating applications that solve real problems and provide great user experiences.\n\nWhen I'm not coding, I enjoy exploring new technologies and working on personal projects.",
                location: "Nagpur",
                email: "krishnashinde8837@gmail.com"
            });

            // Create sample skills
            await Promise.all([
                Skill.create({name: "JavaScript", category: "technical", proficiency: 4}),
                Skill.create({name: "React", category: "technical", proficiency: 4}),
                Skill.create({name: "Node.js", category: "technical", proficiency: 3}),
                Skill.create({name: "UI/UX Design", category: "design", proficiency: 3}),
                Skill.create({name: "Problem Solving", category: "soft_skills", proficiency: 5}),
                Skill.create({name: "Git", category: "tools", proficiency: 4})
            ]);

            // Create sample project
            await Project.create({
                title: "Sample Project",
                description: "A great project that showcases my skills and experience.",
                technologies: ["React", "Node.js", "MongoDB"],
                featured: true,
                completion_date: "2024-01-01"
            });

            // Reload data
            loadPortfolioData();
        } catch (error) {
            console.error('Error creating sample data:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Portfolio</h1>
                    <p className="text-gray-600 mb-6">
                        Get started by adding your profile information and showcasing your work.
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={createSampleData}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                            Create Sample Data
                        </button>
                        <p className="text-sm text-gray-500">
                            Or go to Dashboard → Data to add your information manually.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navigation profile={profile} />
            
            <main>
                <HeroSection profile={profile} />
                
                <div id="about">
                    <AboutSection profile={profile} />
                </div>
                
                {skills.length > 0 && (
                    <div id="skills">
                        <SkillsSection skills={skills} />
                    </div>
                )}
                
                {projects.length > 0 && (
                    <div id="projects">
                        <ProjectsSection projects={projects} />
                    </div>
                )}
                
                {experiences.length > 0 && (
                    <div id="experience">
                        <ExperienceSection experiences={experiences} />
                    </div>
                )}
                
                <div id="contact">
                    <ContactSection profile={profile} />
                </div>
            </main>
            
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-400">
                        © 2024 {profile.full_name}. Built with passion and precision.
                    </p>
                </div>
            </footer>
        </div>
    );
}