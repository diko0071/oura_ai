from .services import get_today

today = get_today()

good_ai_insights_collection = """
Insight / Suggestion 1:
- Contributing factor to the daily sleep score is the amount of REM sleep, which is crucial for memory consolidation and cognitive function. On December 30th, there was a notable increase in REM sleep to 80 minutes, which likely contributed to the higher sleep score of 71 on that day. However, on other days, REM sleep remained around 45-49 minutes, which might have contributed to lower sleep scores.
- Why good: Exact numbers, underlying factors about the metric. And exact metric that can possibly can improved. The clear and clean explanation.

Insight / Suggestion 2:
- Sleep latency, or the time it takes to fall asleep, has also impacted the daily sleep score. Ideally, sleep latency should be between 15-20 minutes, but the data shows it has been consistently higher, ranging from 70 to 97 minutes. This prolonged sleep latency suggests difficulties in falling asleep, which can reduce overall sleep quality and thus lower the sleep score.
- Why good: Exact numbers, clear explanation with simple language for user. And the insight that user can take into account and improve the metric.
"""

bad_ai_insights_collection = """

"""

get_ai_insgihts_for_metric_prompt = f"""
Based on data provided and feature importance. 

Generate 3 sentences about current state of the metric.

Take information about features from the definitions.

Think what user exatly should know about current metrics based on definitions and results (importance and real values). 

Generate 3 sentences to explain what user today metric and why it is that it is (going down or raising up).

Do not make insights / suggestions obvious like: Readiness score bad, because readiness score is 50. Expectaction that you will provide insights based on data and definitions that actully underlyting the data and explain for users that it does mean. Not like HVR was high, but the explanation that it is mean for people who are not familar with it.

Example of BAD insights / explanations: 
{bad_ai_insights_collection}

Example of GOOD insights / explanations:
{good_ai_insights_collection}

The decision about impact of metric you MUST do based on several factors:
1) Importance coefficients of features that are important for target metric.
2) How frequenctly this feature on the list. What new feature on the list that we impact the main metric? 
3) Values of features and target metric. Each feature for current and previous week have real values by days. For last month and 3 month — it has mean values and also features. Keep everything in mind.
4) Focus ONLY on today metric and try to explain today's value of the Target metric. 

Today date: {today}
"""


oura_metrics_definition_daily_sleep_score = """
## Metrics Definitions:
- Sleep Score: Ranging from 0-100, the sleep score is an overall measure of how well you slept.
- Awake Time: Awake time is the time spent awake in bed before and after falling asleep.
- Bedtime: Bedtime is an estimate of the time you went to bed with the intention to sleep.
- Deep Sleep Time: Deep sleep is the most restorative and rejuvenating sleep stage, enabling muscle growth and repair.The amount of deep sleep can vary significantly between nights and individuals. It can make up anywhere between 0-35% of your total sleep time. On average adults spend 15-20% (1-1.5 h) of their total sleep time in deep sleep, the percentage usually decreasing with age.
- Light Sleep Time: Light sleep makes up about 50% of total sleep time for adults, and typically begins a sleep cycle.
- REM Sleep Time: REM (rapid eye movement) sleep is the final sleep stage in a typical sleep cycle. It’s associated with dreaming, memory consolidation, learning and creativity.
- Respiratory Rate: Oura tracks the number of breaths you take per minute while you sleep, and shows your nocturnal average respiratory rate. Although your respiratory rate is not used to score your readiness, it is a good indicator of your health status. The typical respiratory rate for a healthy adult at rest is 12–20 breaths per minute. Because breathing is highly individual, it's best to compare your numbers to your own baseline.
- Restfulness: Sleep disturbances caused by wake-ups and restless time can have a big impact on your sleep quality and daytime cognitive performance. Restless sleep is less restorative than uninterrupted sleep, and it's usually the cause of daytime sleepiness. Disturbances can be caused by various different factors, such as stress, noise, partners, pets or different foods. 
- Resting Heart Rate: Measuring your resting heart rate during the day can give insight into how your body’s doing. A moment of relaxing, meditating or just being still can take your heart rate down, helping your body to recover and re-energize.
- Sleep Efficiency: Sleep efficiency is the percentage of time you actually spend asleep after going to bed. For adults, a generally accepted cut-off score for good sleep efficiency is 85%. It's common for sleep efficiency to slightly decrease with age. For a maximum positive contribution to your sleep score, your sleep efficiency needs to be 95%. You'll see a lowered sleep score if it has taken more than 20 minutes for you to fall asleep, or if you experience one long or multiple shorter wake-ups during the night.
- Sleep Latency: Sleep latency is the time it takes for you to fall asleep. Ideally falling asleep shouldn't take more than 15-20 minutes. Falling asleep immediately (in less than 5 minutes) could be a sign that you're not getting enough sleep for your needs.
- Sleep Midpoint Time: The time in seconds from the start of sleep to the midpoint of sleep. The midpoint ignores awake periods.
- Sleep Timing: Your sleep timing plays an important role in your sleep quality and daytime performance. Most of your body’s essential processes such as your body temperature, hormone release and hunger run in 24-hour cycles called circadian rhythms. Sleeping during the night and staying awake and active during the day can help keep these internal rhythms in balance, and helps you perform better throughout the day. Oura considers your sleep timing to be optimal and aligned with the sun when the midpoint of your sleep falls between midnight and 3 am, allowing some variability for morning and evening types. A timing significantly earlier or later can lower your Sleep Score.
- Total Sleep Time: Total sleep time refers to the total amount of time you spend in light, REM and deep sleep.
- Wake-up Time: Wake-up time is the time you got out of bed.
"""

oura_metrics_definition_daily_readiness_score = """
## Metrics Definitions:
- Readiness Score: Ranging from 0-100, the readiness score helps you identify the days that are ideal for challenging yourself, and those that are better for taking it easy.
- Activity Balance: Activity Balance measures how your activity level over the past days is affecting your readiness to perform. A full bar indicates that you've been active, but kept from training at your maximum capacity. This has boosted your recovery and helped build up your energy levels.
- Average HRV: When a person is relaxed, a healthy heart’s beating rate shows remarkable variation in the time interval between heartbeats. By calculating this variation i.e. your heart rate variability (HRV) while you sleep, Oura can help you better understand your body’s reactions and your readiness to perform. 
    - How does Oura calculate your HRV?
        - Oura calculates your night-time HRV from the rMSSD, a well-known HRV parameter that provides a good view on your Autonomic Nervous System activity. The HRV reading you see in the readiness view is the average of all the 5-minute samples measured while you sleep. The HRV value given by Oura can range from anywhere below 20 to over 100. Defining a normal range is difficult: your own minimum and maximum values depend on several factors, such as your age, hormones, circadian rhythm, lifestyle and overall health. This is why it’s best to compare your numbers to your own baseline. Exercise is one of the best ways to increase HRV and reduce stress. Exercise, like a lot of other things, is dose dependant. In other words, too much can lead to overtraining and negative health consequences. Strenuous exercise may lower HRV for one night but increases future HRV levels.
- Body Temperature: Body temperature variations can reveal a lot about your recovery and overall health. It’s normal for body temperature to rise after eating, drinking or exercising late, or when sleeping in a warm environment. A sudden rise can also indicate that you’re coming down with something. When this happens, it’s a good idea to take your temperature with a thermometer, and allow yourself to rest.
    - How does Oura calculate your body temperature?
        - Oura measures your body temperature while you sleep. It sets the baseline for your normal temperature during the first couple of weeks, and adjusts it if needed as more data is collected. Variations are shown in relation to your baseline, represented by 0.0 in the body temperature deviation graph.
- Previous Day Activity: Your level of physical activity yesterday is one of the key contributors to your Readiness Score. When the contributor is at 100%, you’ll know you’ve balanced your need for activity and rest, and substituted a nice amount of inactive time with low activity. An exceptionally high amount of inactivity or activity leads to a drop in your Readiness Score. If your readiness is low due to intense training and increased Activity Burn, taking time to recover can pay off as improved fitness.
- Recovery Index: Recovery Index measures how long it takes for your resting heart rate to stabilize during the night. A sign of very good recovery is that your resting heart rate stabilizes during the first half of the night, at least 6 hours before you wake up, leaving your body time to recover for the next day. Alcohol, a heavy meal before bed or late exercise speed up your metabolism and keep your heart rate elevated, delaying your recovery and increasing your sleep needs.
- Sleep: How you slept last night can have a significant impact on your readiness to perform during the day. Getting enough good quality sleep is necessary for physical recovery, memory and learning, all part of your readiness to perform. For a maximum positive contribution to your Readiness Score, your Sleep Score needs to be above 88%, and at the high end of your normal range.
- Sleep Balance: Sleep Balance shows if the sleep you've been getting over the past two weeks is in balance with your needs. Typically adults need 7-9 hours of sleep a night to stay healthy, alert, and to perform at their best both mentally and physically.
"""

oura_metrics_definition_daily_activity_score = """
## Metrics Definitions:
- Activity Score: Ranging from 0-100, the activity score is an overall measure of how active you've been today, and over the past 7 days.
- Activity Burn: Activity burn shows the kilocalories you've burned by daily movement and exercise.
- Activity daily movement: Oura gives you a minimum daily Activity Target based on your age, sex and daily readiness. When your Readiness Score is above 85%, your Activity Target will be set higher than your average. Days like these are usually optimal for taking your training to the next level and developing your physical performance. When your readiness drops below 70%, your Activity Target is lowered, and avoiding or reducing intensive training might be in order.
    - How is distance calculated?
        - The distance (mi/km) representing your Activity Target and your progress towards it is the equivalent walking distance of your daily movement and Activity Burn. This means that instead of measuring the actual distance travelled, Oura shows how far you could walk to burn the same amount of net calories. For example, a 5.6 mi / 9 km Activity Target could be met by getting 3 hours of low activity, 45 minutes of medium activity and 5 minutes of high intensity activity.
- Average MET: This is the daily average MET for when you are awake. 
    - About MET:
        - MET or Metabolic Equivalent is a common measure used to express the energy expenditure and intensity of different physical activities. If the MET value of a specific activity is 4, it means that you’re burning 4 times as many calories as you would burn while resting. The time engaged in different activities can be expressed as MET minutes. For example: 30 min x 5 METs = 150 MET min, 30 min x 7 METs = 210 MET min
- High Activity: High activity includes vigorous activities with an intensity level higher or equivalent to jogging.
- Inactive Time: Inactive time includes sitting, standing or otherwise being passive.
- Long periods of inactivity: This contributor shows how well you’ve managed to avoid long periods of inactivity during the past 24 hours. Oura tracks the time you spend sitting, standing or otherwise passive, and guides you to break up long periods of inactivity.
- Low Activity: Low activity includes activities such as casual walking and light housework both indoors and outdoors. During low activity your energy expenditure (calorie burn) is about 2–4 times higher compared to your resting level.
- Medium Activity: Medium activity includes dynamic activities with an intensity level equivalent to brisk walking.
- Meet Daily Targets: Meet Daily Targets shows how often you’ve reached your daily activity targets over the past 7 days. Oura gives you a daily activity target based on your age, sex and readiness level.
- Move Every Hour: Move Every Hour shows how well you’ve managed to avoid long periods of sitting, standing or otherwise being passive during the past 24 hours. Staying active and moving for 2-3 minutes regularly helps you to avoid the harmful effects of inactivity.
- Recovery Time: To improve your fitness, you need regular exercise but also easier days that help your body recover — it’s during rest that your muscles repair and grow. Recovery time tracks the number of easy days you’ve had during a week, and the timing of the last easy day.
    - Optimal = You’ve had enough easy days during the past week
    - Good = You’ve had easy days during the past week, but try to have a new one within the next couple of days
    - Pay attention = You haven’t had an easy day during the past week
- Resting Time: Resting time includes naps and other restful periods that last for at least 5 minutes.
- Stay Active: Moving around regularly and avoiding long periods of inactivity helps you stay healthy, and keeps your metabolism active throughout the day. Having 5-8 hours or less of inactive time a day has a positive effect on your Activity Score.
- Steps: Daily step count is one measure of your daily physical activity. The optimal number of daily steps depends on your age, body size, fitness level and readiness to perform.
- Total Burn: Total Burn, or your total daily energy expenditure includes all the calories you've burned during the day whether active or resting. Tracking your total burn and comparing it to your data history can help you adjust your calorie intake and maintain a healthy weight. While physical activity increases your daily calorie burn, most of your total burn comes from the calories your body burns while at rest, also known as your Basal Metabolic Rate (BMR). Oura begins calculating your total burn at 4 am by logging your estimated BMR. Continuing to calculate until 4 am the next morning, all calories burned by your daily activity are added to the sum.
- Training Frequency: Training Frequency shows how often you've gotten medium to high intensity level activity over the past 7 days. Exercising 3-4 times a week will help you to stay in balance and boost your Activity Score.
- Training Volume: Training Volume measures the amount of medium and high activity you’ve gotten over the past 7 days. Like training frequency, your training volume is important for maintaining and improving your fitness level.
- Walking Equivalency: Walking equivalency shows your daily activity burn as a walking distance.
"""