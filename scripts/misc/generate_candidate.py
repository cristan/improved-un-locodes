# Example usage: python generate_candidate.py IT "Coreno Ausonio" => CO8

import csv
import sys

# Function to generate a three-letter code
def generate_code(place_name):
    # Normalize the place name
    normalized_name = place_name.upper().replace(" ", "")

    # Extract letters based on rules
    first_letter = normalized_name[0]
    second_letter = normalized_name[1] if len(normalized_name) > 1 else 'X'
    last_letter = normalized_name[-1]

    # Combine to form a code
    if len(normalized_name) >= 3:
        return f"{first_letter}{second_letter}{last_letter}"
    else:
        # Handle edge cases where the name is less than 3 letters
        return f"{first_letter}{second_letter}2"

# Function to load existing codes for a specific country from the CSV
def load_existing_codes(country, csv_file):
    existing_codes = set()
    with open(csv_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['Country'] == country:
                existing_codes.add(row['Location'])
    return existing_codes

# Function to generate a non-conflicting code
def generate_non_conflicting_code(country, place_name, existing_codes):
    base_code = generate_code(place_name)
    code = base_code
    counter = 2

    # Check if the generated code conflicts with existing ones
    while code in existing_codes:
        if counter > 9:
            raise Exception("Cannot generate a non-conflicting code.")
        code = f"{base_code[:2]}{counter}"
        counter += 1

    return code

if len(sys.argv) < 3:
    print("You need to pass the country code as the first argument and the place name as the second argument")
    exit()

country = sys.argv[1]
place_name = sys.argv[2]
csv_file_path = '../../data/code-list.csv'

# Load existing codes once
existing_codes = load_existing_codes(country, csv_file_path)

# Generate a non-conflicting code
generated_code = generate_non_conflicting_code(country, place_name, existing_codes)
print(f"Generated Code for {place_name}: {generated_code}")