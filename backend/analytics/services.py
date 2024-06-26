from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
import os 
from datetime import datetime
from .models import Prompts 

def get_today():
    return datetime.now().strftime("%A, %B %d, %Y")

def openai_call(human_message, system_message, user):
    llm = ChatOpenAI(model_name="gpt-4o-2024-05-13", temperature=0, api_key=os.getenv("OPENAI_API_KEY"))
    chat = llm
    messages = [
    SystemMessage(
        content=f'{system_message}.'
    ),
    HumanMessage(content=human_message),
        ]
    
    response = chat.invoke(messages)

    prompts = Prompts.objects.create(
        user=user,
        system_message=system_message,
        user_message=human_message,
        response=response.content
    )

    return response.content 