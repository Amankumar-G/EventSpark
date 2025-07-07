import { Calendar } from "@/components/ui/calendar"

export function Footer() {
  const sections = {
    Product: ["Features", "Pricing", "API"],
    Company: ["About", "Blog", "Careers"],
    Legal: ["Privacy", "Terms", "Cookie Policy"],
  }

  return (
    <footer className="bg-white border-t py-12">
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">Eventify</span>
          </div>
          <p className="mt-4 text-gray-600">
            The complete solution for event organization and discovery.
          </p>
        </div>

        {Object.entries(sections).map(([sectionTitle, links], i) => (
          <div key={i}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              {sectionTitle}
            </h3>
            <ul className="mt-4 space-y-2">
              {links.map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#FF6B6B] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mt-12 border-t pt-8 text-center text-gray-500">
        © 2025 Eventify. All rights reserved.
      </div>
    </footer>
  )
}
