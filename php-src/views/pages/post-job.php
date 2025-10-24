<div>
    <h1 class="text-2xl font-headline font-medium mb-6">Post a Job</h1>
    
    <form class="border-t border-gray-200 pt-6" method="POST" action="/api/post-job">
        <div class="mb-4">
            <label for="title" class="block mb-1">
                Job Title
            </label>
            <input type="text" id="title" name="title" required 
                   placeholder="Enter job title" 
                   class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div class="mb-4">
            <label for="company" class="block mb-1">
                Company
            </label>
            <input type="text" id="company" name="company" required 
                   class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div class="mb-4">
            <label for="location" class="block mb-1">
                Location
            </label>
            <input type="text" id="location" name="location" required 
                   placeholder="Enter location" 
                   class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div class="mb-4">
            <label for="industry" class="block mb-1">
                Industry
            </label>
            <select id="industry" name="industry" required 
                    class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select an industry</option>
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
            </select>
        </div>
        
        <div class="mb-4">
            <label for="compensation" class="block mb-1">
                Compensation (optional)
            </label>
            <input type="text" id="compensation" name="compensation" 
                   placeholder="e.g., $50,000 - $70,000 per year" 
                   class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div class="mb-4">
            <label for="description" class="block mb-1">
                Job Description
            </label>
            <textarea id="description" name="description" rows="6" required 
                      placeholder="Describe the job responsibilities, requirements, and benefits..." 
                      class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        
        <div class="mb-4">
            <label for="email" class="block mb-1">
                Contact Email
            </label>
            <input type="email" id="email" name="email" required 
                   class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div class="mb-6">
            <label for="phone" class="block mb-1">
                Contact Phone (optional)
            </label>
            <input type="tel" id="phone" name="phone" 
                   class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Post Job
        </button>
    </form>
</div>