export default function FeatureCard({ icon, fromColor, toColor, title, description }) {
    return (
        <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-white transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/90 to-purple-500/90 flex items-center justify-center shadow-lg shadow-blue-500/20 backdrop-blur-md border border-white/20">
                {icon}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}
