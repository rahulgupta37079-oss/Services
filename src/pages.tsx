// Page templates for different services
export const navigation = `
<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
            <i class="fas fa-cube text-primary text-3xl mr-3"></i>
            <h1 class="text-2xl font-bold text-gray-900">Passion 3D World</h1>
        </div>
        <div class="hidden md:flex space-x-6">
            <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
            <div class="relative group">
                <button class="text-gray-700 hover:text-primary transition flex items-center">
                    Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div class="absolute hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 py-2 w-56 z-50">
                    <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-gray-100">
                        <i class="fas fa-print mr-2 text-primary"></i>3D Printing
                    </a>
                    <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-gray-100">
                        <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining
                    </a>
                    <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-gray-100">
                        <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal
                    </a>
                    <a href="/pcb-quote" class="block px-4 py-2 hover:bg-gray-100">
                        <i class="fas fa-microchip mr-2 text-primary"></i>PCB Manufacturing
                    </a>
                </div>
            </div>
            <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
        </div>
        <a href="/#quote" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Get Quote
        </a>
    </div>
</nav>
`

export const footer = `
<footer class="bg-gray-900 text-white py-12 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
            <div>
                <div class="flex items-center mb-4">
                    <i class="fas fa-cube text-primary text-2xl mr-2"></i>
                    <h3 class="text-xl font-bold">Passion 3D World</h3>
                </div>
                <p class="text-gray-400">Professional manufacturing services for all your needs.</p>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Services</h4>
                <ul class="space-y-2 text-gray-400">
                    <li><a href="/3d-printing-quote" class="hover:text-white transition">3D Printing</a></li>
                    <li><a href="/cnc-machining-quote" class="hover:text-white transition">CNC Machining</a></li>
                    <li><a href="/sheet-metal-quote" class="hover:text-white transition">Sheet Metal</a></li>
                    <li><a href="/pcb-quote" class="hover:text-white transition">PCB Manufacturing</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Contact</h4>
                <ul class="space-y-2 text-gray-400">
                    <li><i class="fas fa-phone mr-2"></i>+91 9137361474</li>
                    <li><i class="fas fa-envelope mr-2"></i>info@passion3dworld.com</li>
                    <li>Mon-Fri: 9AM-12PM</li>
                    <li>Sat: 9AM-12PM</li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Follow Us</h4>
                <div class="flex space-x-4">
                    <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-facebook text-2xl"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-instagram text-2xl"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-twitter text-2xl"></i></a>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Passion 3D World. All rights reserved.</p>
        </div>
    </div>
</footer>
`

export const commonHead = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script>
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',
                secondary: '#7C3AED',
            }
        }
    }
}
</script>
<link href="/static/style.css" rel="stylesheet">
`
