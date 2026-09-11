import React, { useState } from 'react';
import { Star, MessageSquare, CornerDownRight, Check, Send, Sparkles } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview, hotelProfile } = useHotel();
  const { currentUser } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [comment, setComment] = useState('');
  const [roomCategory, setRoomCategory] = useState('AC Room');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !customerName.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      hotelId: hotelProfile.id,
      customerName: customerName.trim(),
      customerId: currentUser?.id,
      rating,
      comment: comment.trim(),
      roomCategory,
      date: new Date().toISOString().split('T')[0]
    };

    addReview(newRev);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div id="section-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Guest Stories & Testimonials</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
          Experiences of Our Honored Guests
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Read genuine impressions from guests who have stayed in our oceanfront suites and sampled our cafeteria cuisine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.customerName}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {rev.roomCategory || 'Verified Guest'}
                    </span>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              {/* Owner Reply if available */}
              {rev.ownerReply && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-1 mt-3">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold">
                    <CornerDownRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>Response from Hotel General Manager</span>
                    {rev.replyDate && (
                      <span className="text-[10px] font-normal text-slate-400">({rev.replyDate})</span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">
                    {rev.ownerReply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right 5 cols: Write a Review Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
              Share Your Experience
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Have you stayed with us? Help future travelers by sharing your feedback.
            </p>
          </div>

          {submitted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your review has been recorded.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Star Rating Picker */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Overall Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-slate-700 text-sm">{rating}.0 / 5.0</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room Category Stayed In</label>
              <select
                value={roomCategory}
                onChange={(e) => setRoomCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="AC Room">Deluxe AC King Room</option>
                <option value="Non-AC Room">Classic Garden Breeze Room</option>
                <option value="Double AC Room">Executive Double AC Family Suite</option>
                <option value="Bamboo AC Room">Signature Bamboo Sanctuary AC Villa</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Review & Impressions</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="What did you love about your stay, cafeteria meals, or hotel services?"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
