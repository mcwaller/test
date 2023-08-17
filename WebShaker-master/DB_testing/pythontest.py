import datetime

# Get the current date and time
current_datetime = datetime.datetime.now()

# Format the datetime to display only the time in hh:mm format
time_only = current_datetime.strftime('%H:%M')

print("Current Time:", time_only)
