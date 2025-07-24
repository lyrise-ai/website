import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from '../../../config/emailjs.config'

function ROICalculator() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        clients: '',
        hours: '',
        cost: ''
    })
    const [results, setResults] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const calculateROI = async () => {
        const { name, email, clients, hours, cost } = formData

        if (!name || !email || !clients || !hours || !cost) {
            alert('Please fill in all fields')
            return
        }

        const clientsNum = parseInt(clients)
        const hoursNum = parseFloat(hours)
        const costNum = parseFloat(cost)

        const totalHours = clientsNum * hoursNum
        const totalCost = totalHours * costNum

        const calculatedResults = {
            name,
            email,
            clients: clientsNum,
            hours: hoursNum,
            cost: costNum,
            totalHours,
            totalCost
        }

        setResults(calculatedResults)

        // Send email notification using EmailJS
        try {
            console.log('📧 Starting email send process...')
            console.log('EmailJS Config:', {
                publicKey: emailjsConfig.publicKey ? '✅ Set' : '❌ Missing',
                serviceId: emailjsConfig.serviceId ? '✅ Set' : '❌ Missing',
                templateId: emailjsConfig.templateId ? '✅ Set' : '❌ Missing'
            })

            // Check if EmailJS is configured
            if (!emailjsConfig.publicKey || !emailjsConfig.serviceId || !emailjsConfig.templateId) {
                console.error('❌ EmailJS not configured properly!')
                console.log('Missing credentials:', {
                    publicKey: !emailjsConfig.publicKey,
                    serviceId: !emailjsConfig.serviceId,
                    templateId: !emailjsConfig.templateId
                })
                alert('Email notification setup incomplete. Please check console for details.')
                return
            }

            const templateParams = {
                to_email: 'mbanoub@lyrise.ai',
                from_name: name,
                user_email: email,
                clients_per_year: clientsNum,
                hours_per_client: hoursNum,
                cost_per_hour: costNum,
                total_hours_wasted: totalHours.toLocaleString(),
                total_cost_wasted: totalCost.toLocaleString(),
                message: `New ROI Calculator Submission:
        
Name: ${name}
Email: ${email}
Clients/Year: ${clientsNum.toLocaleString()}
Hours/Client: ${hoursNum}
Cost/Hour: $${costNum}

CALCULATED RESULTS:
Hours Wasted: ${totalHours.toLocaleString()} hrs
Cost Wasted: $${totalCost.toLocaleString()}

This lead came from the KYC/AML ROI Calculator on the website.`
            }

            console.log('📋 Template params:', templateParams)

            // Initialize EmailJS
            console.log('🔧 Initializing EmailJS...')
            emailjs.init(emailjsConfig.publicKey)

            console.log('📤 Sending email...')
            const result = await emailjs.send(
                emailjsConfig.serviceId,
                emailjsConfig.templateId,
                templateParams
            )

            console.log('✅ Email sent successfully!', result)
            // Show success message to user
            alert('ROI calculated and notification sent successfully!')

        } catch (error) {
            console.error('❌ Failed to send email:', error)
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                text: error.text
            })

            // Show user-friendly error message
            alert(`Email notification failed: ${error.message || 'Unknown error'}. ROI calculation completed successfully.`)
        }
    }

    return (
        <>
            {/* Desktop View */}
            <div className="hidden lg:flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h3 className="text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[30px] lg:text-[40px] leading-[120%] mb-4">
                            KYC/AML ROI Calculator
                        </h3>
                        <p className="text-center text-[18px] text-[#2C2C2C] font-outfit max-w-2xl">
                            Calculate how much time and money you could save with AI automation
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-[20px] p-8 w-[80vw] max-w-4xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Form Section */}
                            <div className="flex flex-col gap-4">
                                <h4 className="text-[24px] font-[600] text-[#2C2C2C] mb-4 font-outfit">
                                    Enter Your Details
                                </h4>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="number"
                                    name="clients"
                                    placeholder="Clients Per Year"
                                    value={formData.clients}
                                    onChange={handleInputChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="number"
                                    name="hours"
                                    placeholder="Hours Per Client"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="number"
                                    name="cost"
                                    placeholder="Cost Per Hour ($)"
                                    value={formData.cost}
                                    onChange={handleInputChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    onClick={calculateROI}
                                    className="w-full bg-black text-white rounded-lg px-8 py-4 text-[16px] font-semibold hover:bg-gray-900 transition-colors duration-200 font-outfit"
                                >
                                    Calculate ROI
                                </button>
                            </div>

                            {/* Results Section */}
                            <div className="flex flex-col">
                                {results ? (
                                    <div className="bg-[#e6f2f8] p-6 rounded-lg">
                                        <h4 className="text-[24px] font-[600] text-[#2C2C2C] mb-4 font-outfit">
                                            🔍 Your KYC/AML ROI Snapshot
                                        </h4>

                                        <div className="space-y-3 text-[16px] font-outfit">
                                            <p><strong>Name:</strong> {results.name}</p>
                                            <p><strong>Email:</strong> {results.email}</p>
                                            <p><strong>Clients/Year:</strong> {results.clients.toLocaleString()}</p>
                                            <p><strong>Avg Hours/Client:</strong> {results.hours}</p>
                                            <p><strong>Cost/Hour:</strong> ${results.cost}</p>

                                            <hr className="my-4 border-gray-300" />

                                            <p className="text-[18px] font-[600] text-red-600">
                                                <strong>Hours Wasted:</strong> {results.totalHours.toLocaleString()} hrs
                                            </p>
                                            <p className="text-[18px] font-[600] text-red-600">
                                                <strong>Cost Wasted:</strong> ${results.totalCost.toLocaleString()}
                                            </p>

                                            <hr className="my-4 border-gray-300" />

                                            <p className="text-[16px] font-[500]">
                                                <strong>📞 Book a full AI audit:</strong>{' '}
                                                <a
                                                    href="https://calendly.com/yourlink"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    Schedule here
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-[#f7f9fc] p-6 rounded-lg flex items-center justify-center min-h-[300px]">
                                        <p className="text-[18px] text-gray-500 font-outfit text-center">
                                            Fill out the form to see your ROI calculation
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden flex items-center justify-center flex-col gap-8 mt-[10vh] mb-[10vh] px-[5vw]">
                <div className="flex flex-col items-center justify-center gap-2">
                    <h3 className="text-[#2C2C2C] font-outfit font-[700] text-[28px] leading-[120%] text-center">
                        KYC/AML ROI Calculator
                    </h3>
                    <p className="text-center text-[16px] text-[#2C2C2C] font-outfit">
                        Calculate how much time and money you could save with AI automation
                    </p>
                </div>

                <div className="bg-white shadow-lg rounded-[20px] p-6 w-full">
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="number"
                            name="clients"
                            placeholder="Clients Per Year"
                            value={formData.clients}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="number"
                            name="hours"
                            placeholder="Hours Per Client"
                            value={formData.hours}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="number"
                            name="cost"
                            placeholder="Cost Per Hour ($)"
                            value={formData.cost}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg text-[16px] font-outfit focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={calculateROI}
                            className="w-full bg-black text-white rounded-lg px-8 py-4 text-[16px] font-semibold hover:bg-gray-900 transition-colors duration-200 font-outfit"
                        >
                            Calculate ROI
                        </button>
                    </div>

                    {results && (
                        <div className="bg-[#e6f2f8] p-4 rounded-lg mt-6">
                            <h4 className="text-[20px] font-[600] text-[#2C2C2C] mb-4 font-outfit">
                                🔍 Your KYC/AML ROI Snapshot
                            </h4>

                            <div className="space-y-2 text-[14px] font-outfit">
                                <p><strong>Name:</strong> {results.name}</p>
                                <p><strong>Email:</strong> {results.email}</p>
                                <p><strong>Clients/Year:</strong> {results.clients.toLocaleString()}</p>
                                <p><strong>Avg Hours/Client:</strong> {results.hours}</p>
                                <p><strong>Cost/Hour:</strong> ${results.cost}</p>

                                <hr className="my-3 border-gray-300" />

                                <p className="text-[16px] font-[600] text-red-600">
                                    <strong>Hours Wasted:</strong> {results.totalHours.toLocaleString()} hrs
                                </p>
                                <p className="text-[16px] font-[600] text-red-600">
                                    <strong>Cost Wasted:</strong> ${results.totalCost.toLocaleString()}
                                </p>

                                <hr className="my-3 border-gray-300" />

                                <p className="text-[14px] font-[500]">
                                    <strong>📞 Book a full AI audit:</strong>{' '}
                                    <a
                                        href="https://calendly.com/yourlink"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        Schedule here
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ROICalculator 