import { REVIEWS } from '@/lib/content'

export function ReviewsSection() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Reviews</p>
        <h2>What clients are saying.</h2>
        <div className="reviews-grid">
          {REVIEWS.map((review) => (
            <article key={review.author} className="review-card">
              <p className="review-stars" aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p className="review-text">&ldquo;{review.text}&rdquo;</p>
              <p className="review-author">{review.author}</p>
              <p className="review-vehicle">{review.vehicle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
