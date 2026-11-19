total_volume = 18.0  # Total solution volume in mL.
tube_count = 4       # Number of tubes.
# Try changing / to // in the next line
volume_per_tube = total_volume // tube_count  # Divide equally.
remaining_after_one = total_volume - volume_per_tube  # Subtract one portion.
print("Volume per tube:", volume_per_tube)
print("Remaining after one tube:", remaining_after_one)