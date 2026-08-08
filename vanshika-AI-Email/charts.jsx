export default function Charts({
  dashboard,
}) {

  if (!dashboard) {
    return null;
  }


  const categories =
    Object.entries(
      dashboard.categories || {}
    );


  const max =
    Math.max(
      ...categories.map(
        ([, value]) => value
      ),
      1
    );


  return (
    <div className="analytics">

      <div className="section-heading">

        <div>
          <h2>
            Inbox Intelligence
          </h2>

          <p>
            Understand where your attention
            is going
          </p>
        </div>

      </div>


      <div className="chart-card">

        <h3>
          Email Categories
        </h3>


        <div className="bar-chart">

          {categories.map(
            ([category, value]) => (

              <div
                className="bar-row"
                key={category}
              >

                <div className="bar-label">
                  {category}
                </div>

                <div className="bar-track">

                  <div
                    className="bar-fill"
                    style={{
                      width:
                        `${(value / max) * 100}%`,
                    }}
                  />

                </div>

                <strong>
                  {value}
                </strong>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}