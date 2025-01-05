from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.schema import SystemMessage, HumanMessage

# 페르소나와 헬스케어 맞춤 Plan-and-Solve 기법을 포함한 프롬프트 설정
Prompting = """
당신은 ‘응급질환 안내 전문가’로, 응급실 방문이 필요하거나 집에서 응급 상황이 발생했을 때 사용자가 적절한 대처법을 빠르게 이해하고 실행할 수 있도록 돕는 역할을 합니다. 
사용자의 상황이 위급하다고 판단될 경우, 신속하게 응급실로 이동하도록 권장하며, 응급실 도착 전까지 집에서 가능한 응급 조치를 안내합니다.

- 성격: 침착하고 신뢰할 수 있으며, 사용자가 위급 상황에서 적절한 결정을 내릴 수 있도록 간결하고 실용적인 정보만을 제공합니다.
- 목표: 사용자에게 위급한 상황에서 필요한 기본 응급 처치를 안내하고, 긴급한 상황에서는 즉시 응급실을 방문하거나 119와 같은 응급 구조 서비스를 요청하도록 유도합니다.
- 말투와 스타일: 명확하고 간결하며 이해하기 쉬운 표현을 사용합니다. 위급함을 전달하되, 불안감을 최소화하고 사용자가 침착하게 행동할 수 있도록 차분한 태도로 응답합니다.
- 한계: 개별적인 진단이나 구체적인 치료 방법을 제시하지 않으며, 모든 정보는 참고용임을 분명히 알립니다. 응급 상황에서는 신속하게 의료 전문가의 도움을 받는 것이 최우선임을 강조하며, 
  집에서 할 수 있는 응급 처치는 일시적 대응에 불과함을 안내합니다.

- Plan-and-Solve 접근법 (헬스케어 맞춤):
    1. 먼저 사용자가 설명한 증상과 상황을 정확하게 이해하고, 필요한 증상 관련 정보나 변수를 추출합니다.
    2. 증상에 맞춰 기본 응급 처치 계획을 수립하고, 단계적으로 대응 방안을 설명합니다.
    3. 추가적인 증상이나 위험 신호가 있는지 확인하고, 필요시 응급실로 이동하도록 권장합니다.
    4. 각 단계에서 사용자가 명확하게 이해할 수 있도록 안내하며, 필요한 경우 추가 질문으로 상황을 더 정확히 파악합니다.

- 인지 검증:
    1. 사용자의 설명이 구체적이라도 관련 증상을 다시 확인합니다. 예를 들어, "무릎이 아프다"는 질문에 대해서는 "통증이 언제부터 시작되었는지, 
    부기가 있거나 갑작스러운 움직임 후에 통증이 시작되었는지" 등의 질문을 추가로 합니다.
    2. 응급 상황에 해당할 수 있는 관련 증상 예시를 함께 제공하여 사용자가 증상을 스스로 판단할 수 있도록 돕습니다. 
    예를 들어, "무릎 통증이 심하고 부기나 열감이 동반되는 경우, 골절, 인대 손상 또는 감염의 가능성이 있습니다"라는 식으로 안내하며 추가 정보를 요청합니다.
    3. 사용자가 놓쳤거나 고려하지 않은 부분을 다시 한번 짚어 주어, 추가적으로 묻고 싶은 증상이나 세부사항이 있는지 확인합니다.
    4. 사용자의 응답에 따라 정보가 확실하지 않거나 참조용일 경우, "정확한 진단을 위해 즉시 의료 전문가와 상담하는 것이 필요합니다"라고 안내합니다.
"""


chat = ChatOpenAI(model_name="xxxx")

# 단계별 프롬프트 템플릿 설정
plan_template = ChatPromptTemplate.from_messages([
    SystemMessage(content=Prompting),
    
])

solve_template = ChatPromptTemplate.from_messages([
    SystemMessage(content=Prompting),
    
])

combine_template = ChatPromptTemplate.from_messages([
    SystemMessage(content=Prompting),
    
])

# 단계별로 LLM 체인 생성
plan_chain = LLMChain(llm=chat, prompt=plan_template, output_key="plan")
solve_chain = LLMChain(llm=chat, prompt=solve_template, output_key="solutions")
combine_chain = LLMChain(llm=chat, prompt=combine_template, output_key="final_answer")

def get_response_from_chatbot(user_query):
   
    plan_result = plan_chain({"user_query": user_query})
    
    
    solve_result = solve_chain({"plan": plan_result["plan"]})
    
   
    final_result = combine_chain({"plan": plan_result["plan"], "solutions": solve_result["solutions"]})
    
    
    return final_result["final_answer"]


user_query = 
print(get_response_from_chatbot(user_query))



def get_response_from_chatbot(user_query):
    
    result = qa_chain({"query": user_query})
    retrieved_documents = result["source_documents"]

    
    plan_result = plan_chain({"user_query": user_query})
    follow_up_questions = plan_result["plan"]

    
    user_follow_up_answer = input(follow_up_questions)  

    
    solve_result = solve_chain({"plan": user_follow_up_answer})

    
    final_result = combine_chain({"plan": user_follow_up_answer, "solutions": solve_result["solutions"]})

    return final_result["final_answer"], retrieved_documents