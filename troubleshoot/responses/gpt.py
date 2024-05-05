from openai import OpenAI


client =OpenAI(
    # api_key = "pk-yuLcYPQMmUsyHvhHvuHwgHiPLWYKoaiFnmfycNsbnFGRLvaE",
    # api_key = "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",
    base_url= 'https://free.churchless.tech/v1/chat/completions'
)

example1 = [
    {'role':'user', 'content':'I have issues with my wifi connection'},
    {'role':'assistant', 'content': "Are you asking for a friend ? because your wifi connection \
    seems to be working perfectly. If so, can you give more details on the issue you're facing ?"},
    {'role':'user', 'content':'Yes, Alright'}
]
example2 = [
    {'role':'user', 'content':'My WIFI connection keeps fluctuating, it stops then starts working again after sometime'},
    {'role':'assistant', 'content': "This might be network issue from your wifi router, kindly change the \
        the position of the router to where it network is the greatest"},
    {'role':'user', 'content':'Alright, let me try that'}
]
example3 = [
    {'role':'user', 'content':'my wifi connection speed tends to be slow any time I am connected to it'},
    {'role':'assistant', 'content': "Wifi being slow can most times be due to backgroud connection usages \
    or the system trying to update itself. You can disable most of these by going to the systems' settings"},
    {'role':'user', 'content':'How can I achieve this?'}
]
example4 = [
    {'role':'user', 'content':'I have issue with my wifi router'},
    {'role':'assistant', 'content': "Sorry, My functionality is limited. I can help you troubleshoot \
    your wifi connection on your system. If you have any trouble or issues relating that, I will gladly help out"},
]
example6 = [
    {'role':'user', 'content':'What is the difference between wifi connection and wifi router ?'},
    {'role':'assistant', 'content': "Sorry, My functionality is limited. I can help you troubleshoot \
    your wifi connection on your system. If you have any trouble or issues relating that, I will gladly help out"},
]
example5 = [
    [
    {'role':'user', 'content':'I use internet connection connected via bluetooth from my smartphone to my latop, \
        but it seems the connection is very slow. How can I resolve this ?'},
    {'role':'assistant', 'content': "You should check the internet connection on your smartphone, or check the background apps in both \
    your smartphone and your laptop using the internet, as this can slow the internet connection also. Hope this helps"},
    {'role':'user', 'content':'Yeah, thanks'}
    ]
]

prompt = f"""
    You are a WIFI Troubleshooter(Internet Connection Troubleshooter), You troubleshoot wifi connection(internet connection) \
    on the system. \
    Given the conversation flow examples delimited by ```, \
    understand how the conversation flow can be with the user and the appropriate response you can give. \

    conversation flow examples: ```{example1}```,```{example2}```,```{example3}```,```{example5}``` \

    Your response must be in a friendly manner and explain like you explaining to a teenager \
    
    You may provide any external URLs if the need arises \
    These URLs should be provided using anchor tag in HTML format with inline styling of color blue giving it a name that seems fit.\


    If you are asked a question that is not related to Wifi Troubleshooting/Internet Connection Troubleshooting \
    respond with "I'm sorry but your question is beyond my functionalities".
    You can check different unrelated questions and possible response you can give below \


    unrelated questions and responses: {example4}, {example6}
"""


def ask_openai(message):
    response = client.chat.completions.create(
        model = "gpt-3.5-turbo",
        max_tokens = 100,
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": message},
        ],
    )
    
    answer = response.choices[0].message.content.strip()
    return answer