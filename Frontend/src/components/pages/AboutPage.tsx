import React from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Calendar, Code, Coffee, Music } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Progress } from "../ui/progress";
import { contentData } from "../../data/content";
import { Link } from "react-router-dom";
interface AboutPageProps {
  onPageChange: (page: string) => void;
}

export function AboutPage() {
  const { personal, skills, experience } = contentData;

  const interests = [
    {
      icon: Code,
      label: "Coding",
      description: "Always learning new technologies",
    },
    { icon: Coffee, label: "Coffee", description: "Fuel for productivity" },
    { icon: Music, label: "Music", description: "Inspiration for creativity" },
  ];

  const stats = [
    { label: "Years of Experience", value: "3+" },
    { label: "Projects Completed", value: "10+" },
    { label: "Happy Clients", value: "25+" },
    { label: "Coffee Consumed", value: "∞" },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get to know the person behind the code. My journey, experiences,
              and what drives me.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative mb-8">
                <ImageWithFallback
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-48 h-48 rounded-2xl object-cover mx-auto lg:mx-0 shadow-xl"
                />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{personal.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{personal.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Available for new projects</span>
                </div>
              </div>

              <Link to="/contact">
                <Button size="lg" className="w-full lg:w-auto">
                  Let's Work Together
                </Button>
              </Link>
            </motion.div>

            {/* Bio & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4">My Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I'm a passionate full-stack developer with over 3 years of
                    experience creating digital solutions that make a
                    difference. My journey started with a curiosity about how
                    websites work, and it quickly evolved into a love for
                    building complex applications that solve real-world
                    problems.
                  </p>
                  <p>
                    I believe in writing clean, maintainable code and creating
                    user experiences that are both beautiful and functional.
                    When I'm not coding, you can find me exploring new
                    technologies, contributing to open source projects, or
                    sharing knowledge with the developer community.
                  </p>
                  <p>
                    I'm always excited to take on new challenges and work with
                    teams that share my passion for creating exceptional digital
                    experiences.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills & Interests */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8">Technical Skills</h2>
              <div className="space-y-6">
                {skills.slice(0, 8).map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill}</span>
                      <span className="text-sm text-muted-foreground">
                        {85 + Math.floor(Math.random() * 15)}%
                      </span>
                    </div>
                    <Progress
                      value={85 + Math.floor(Math.random() * 15)}
                      className="h-2"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8">When I'm Not Coding</h2>
              <div className="space-y-6">
                {interests.map((interest, index) => (
                  <motion.div
                    key={interest.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-background transition-colors"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <interest.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{interest.label}</h3>
                      <p className="text-muted-foreground text-sm">
                        {interest.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Professional Experience</h2>
            <p className="text-muted-foreground">
              My journey through different roles and companies
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* {experience.map((job, index) => (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {job.position}
                        </h3>
                        <p className="text-lg text-primary">{job.company}</p>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {job.duration}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </CardContent>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50" />
                </Card>
              </motion.div>
            ))} */}
          </div>
        </div>
      </section>
    </div>
  );
}
