import camelot
import pandas as pd

pdf_file = "2024/Water_Quality_Canals_2024.pdf"

# Extract tables from all pages
tables = camelot.read_pdf(
    pdf_file,
    pages="all",
    flavor="stream"
)

all_data = []

for table in tables:
    df = table.df

    # Search for rows containing DELHI
    delhi_rows = df[
        df.astype(str)
          .apply(lambda col: col.str.contains("DELHI", case=False, na=False))
          .any(axis=1)
    ]

    if not delhi_rows.empty:
        all_data.append(delhi_rows)

if all_data:
    result = pd.concat(all_data, ignore_index=True)
    result.to_csv("Water_Quality_Canals_2024.csv", index=False)
    print(f"Found {len(result)} Delhi records")
else:
    print("No Delhi records found")