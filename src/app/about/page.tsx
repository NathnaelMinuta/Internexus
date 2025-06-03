import Link from 'next/link';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <p className="mb-4 text-lg">
        Hi! My name is Nathnael Minuta. I am passionate about software engineering, web development, and building tools that make life easier. I enjoy learning new technologies and collaborating on impactful projects.
      </p>
      <p className="mb-4 text-lg">
        You can find out more about my professional background and connect with me on LinkedIn:
      </p>
      <Link href="https://www.linkedin.com/in/nathnaelminuta/" target="_blank" className="text-primary underline font-semibold">
        linkedin.com/in/nathnaelminuta
      </Link>
    </div>
  );
} 