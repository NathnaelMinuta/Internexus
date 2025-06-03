"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Internexus</h1>
              <span className="ml-2 text-sm text-gray-300">| Nathnael Minuta</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`${pathname === '/' ? 'border-white text-white border-b-2' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'} inline-flex items-center px-1 pt-1 text-sm font-medium`}>Dashboard</Link>
              <Link href="/projects" className={`${pathname.startsWith('/projects') ? 'border-white text-white border-b-2' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'} inline-flex items-center px-1 pt-1 text-sm font-medium`}>Projects</Link>
              <Link href="/meetings" className={`${pathname.startsWith('/meetings') ? 'border-white text-white border-b-2' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'} inline-flex items-center px-1 pt-1 text-sm font-medium`}>Meetings</Link>
              <Link href="/events" className={`${pathname.startsWith('/events') ? 'border-white text-white border-b-2' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'} inline-flex items-center px-1 pt-1 text-sm font-medium`}>Events</Link>
              <Link href="/about" className={`${pathname.startsWith('/about') ? 'border-white text-white border-b-2' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'} inline-flex items-center px-1 pt-1 text-sm font-medium`}>About</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent text-white">
              Salesforce Intern
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
} 